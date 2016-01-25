/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    // Draw the pie part of the pie chart. Features include:
    // 1. able to draw a pie based on the input data set and pie options
    // 2. the input data set structure accepts an array of numbers or an array of objects
    //    as long as objects contain "value" elements for drawing pie slices
    // 3. able to configure the color of each pie slice
    // 4. update the pie when the data set changes, including adding or removing slices

    fluid.defaults("floe.chartAuthoring.pieChart.pie", {
        gradeNames: ["floe.chartAuthoring.totalRelaying", "floe.d3ViewComponent",  "autoInit"],
        model: {
            // dataSet accepts:
            // 1. an array of primitive values, such as numbers;
            // 2. an array of objects. The "value" element of each object needs to containe the value for drawing each pie slice.
            // Example: [{id: string, value: number} ... ]
            dataSet: [],
            pieTitle: "Pie Chart",
            pieDescription: "A pie chart."
            // Supplied by relaying in floe.chartAuthoring.totalRelaying grade
            // total: {
            //     value: number,
            //     percentage: number
            // }
        },
        pieOptions: {
            width: 300,
            height: 300,
            // An array of colors to fill slices generated for corresponding values of model.dataSet
            // Or, a d3 color scale that's generated based off an array of colors
            colors: null,
            outerRadius: null,
            innerRadius: null,
            animationDuration: 750,
            // A fluid.stringTemplate used to render the values displayed
            // within the pie chart slices
            // available variables for the template are:
            // - value: the raw value of the data
            // - percentage: the percentage of the data value out of the total value
            // - total: the total value of all data in the dataset
            sliceTextDisplayTemplate: "%value",
            // Number of digits to display after decimal when rendering
            // percentages for pie slices
            sliceTextPercentageDigits: 0,
            // boolean to configure drawing a background circle for the pie
            displayPieBackground: true,
            // color of the background circle, if drawn
            pieBackgroundColor: "#F2F2F2"
        },
        styles: {
            pie: "floe-ca-pieChart-pie",
            slice: "floe-ca-pieChart-slice",
            text: "floe-ca-pieChart-text"
        },
        selectors: {
            pie: ".floec-ca-pieChart-pie",
            slice: ".floec-ca-pieChart-slice",
            text: ".floec-ca-pieChart-text",
            title: ".floec-ca-pieChart-title",
            description: ".floec-ca-pieChart-description",
            background: ".floec-ca-pieChart-background"
        },
        events: {
            onPieCreated: null,  // Fire when the pie is created. Ready to register D3 DOM event listeners,
            onPieRedrawn: null // Fire when the pie is redrawn.
        },
        listeners: {
            "onCreate.create": {
                funcName: "floe.chartAuthoring.pieChart.pie.create",
                args: ["{that}"]
            }
        },
        modelListeners: {
            dataSet: {
                funcName: "{that}.draw",
                excludeSource: "init"
            }
        },
        invokers: {
            draw: {
                funcName: "floe.chartAuthoring.pieChart.pie.draw",
                args: ["{that}"]
            },
            textTransform: {
                funcName: "floe.chartAuthoring.pieChart.textTransform",
                args: ["{that}.arc", "{arguments}.0"]
            }
        }
    });

    floe.chartAuthoring.pieChart.pie.addSlices = function (that) {
        var color = that.colorScale,
        arc = that.arc,
        sliceClass = that.classes.slice,
        textClass = that.classes.text;

        // Draw pie slices
        that.paths.enter()
            .append("path")
            .attr({
                "fill": function(d, i) {
                    return color(i);
                },
                "d": arc,
                "class": sliceClass,
                // Use the 'presentation' role because these are child images of the larger SVG image - they shouldn't be identified as individual images, at least at the moment
                "role": "presentation"
            })
            .each(function (d) {
                // Store current values for later use in interpolation function when redrawing
                this._current = d;
            });


        // Create texts for pie slices
        that.texts.enter()
            .append("text")
            .attr({
                "text-anchor": "middle",
                "class": textClass,
                "transform": that.textTransform
            });
    };

    floe.chartAuthoring.pieChart.pie.updateSlices = function (that) {
        // Update and redraw arcs of existing slices
        var arc = that.arc,
            animationDuration = that.options.pieOptions.animationDuration,
            percentageDigits = that.options.pieOptions.sliceTextPercentageDigits,
            totalValue = that.model.total.value,
            sliceTextDisplayTemplate = that.options.pieOptions.sliceTextDisplayTemplate;

        // Standard D3 pie arc tweening transition, as per http://bl.ocks.org/mbostock/1346410
        that.paths.transition().duration(animationDuration).attrTween("d", function (d) {
            var interpolation = d3.interpolate(this._current, d);
            this._current = interpolation(0);
            return function(t) {
                return arc(interpolation(t));
            };
        });

        // Update and reposition text labels for existing slices
        that.texts.text(function (d) {
            return floe.d3ViewComponent.getTemplatedDisplayValue(totalValue, percentageDigits, sliceTextDisplayTemplate, d);
        });

        that.texts.transition().duration(animationDuration).attr("transform", that.textTransform);

    };

    floe.chartAuthoring.pieChart.pie.removeSlices = function (that) {
        that.paths.exit().remove();

        that.texts.exit().remove();
    };

    floe.chartAuthoring.pieChart.pie.draw = function (that) {
        var pieGroup = that.pieGroup,
            pie = that.pie,
            dataSet = that.model.dataSet;

        that.paths = pieGroup.selectAll("path")
            .data(pie(dataSet));
        that.texts = pieGroup.selectAll("text")
            .data(pie(dataSet));

        floe.chartAuthoring.pieChart.pie.addSlices(that);

        floe.chartAuthoring.pieChart.pie.updateSlices(that);

        floe.chartAuthoring.pieChart.pie.removeSlices(that);

        that.events.onPieRedrawn.fire();
    };

    floe.chartAuthoring.pieChart.pie.create = function (that) {
        var container = that.container,
            p = that.options.pieOptions,
            width = p.width,
            height = p.height,
            colors = p.colors,
            outerRadius = p.outerRadius || width / 2,
            innerRadius = p.innerRadius || 0,
            displayPieBackground = p.displayPieBackground,
            pieBackgroundColor = p.pieBackgroundColor,
            pieClass = that.classes.pie,
            titleClass = that.classes.title,
            descriptionClass = that.classes.description,
            backgroundClass = that.classes.background;

        that.arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        that.pie = d3.layout.pie()
            .value(function (d) {
                return typeof (d) === "object" ? d.value : d;
            });

        that.svg = that.jQueryToD3(container)
            .append("svg")
            .attr({
                "width": width,
                "height": height,
                "class": pieClass,
                "viewBox": floe.chartAuthoring.pieChart.getViewBoxConfiguration(0,0, width, height),
                // Set aria role to image - this causes the pie to appear as a
                // static image to AT rather than as a number of separate
                // images
                "role": "img"
            });

        // Draw a background circle for the pie if configured
        if(displayPieBackground) {
            that.svg
                .append("circle")
                .attr({
                    "cx": outerRadius,
                    "cy": outerRadius,
                    "r": outerRadius,
                    "fill": pieBackgroundColor,
                    "class": backgroundClass
                });
        }

        that.svg
            .append("title")
            .attr({
                "class": titleClass
            })
            .text(that.model.pieTitle);

        // Allocate ID for the title element
        var pieTitleId = fluid.allocateSimpleId(that.locate("title"));

        that.svg
            .append("desc")
            .attr({
                "class": descriptionClass
            })
            .text(that.model.pieDescription);

        // Allocate ID for the desc element
        var pieDescId = fluid.allocateSimpleId(that.locate("description"));

        // Now that they've been created and have IDs, explicitly associate SVG
        // title & desc via aria-labelledby
        that.svg.attr({
            "aria-labelledby": pieTitleId + " " + pieDescId
        });


        that.pieGroup = that.svg.append("g")
            .attr({
                "transform": "translate(" + outerRadius + "," + outerRadius + ")"
            });

        that.colorScale = (typeof(colors) === "function") ? colors : floe.d3.getColorScale(colors);

        that.draw();

        that.events.onPieCreated.fire();
    };

    floe.chartAuthoring.pieChart.textTransform = function (arc, d) {
        return "translate(" + arc.centroid(d) + ")";
    };

    floe.chartAuthoring.pieChart.getViewBoxConfiguration = function (x, y, width, height) {
        return x + "," + y + "," + width + "," + height;
    };

})(jQuery, fluid);
