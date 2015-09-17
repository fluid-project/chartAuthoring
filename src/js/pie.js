/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    // Draw the pie part of the pie chart. Features include:
    // 1. able to draw a pie based on the input data set and pie options
    // 2. the input data set structure accepts an array of numbers or an array of objects
    //    as long as objects contain "value" elements for drawing pie slices
    // 3. able to configure the color of each pie slice
    // 4. update the pie when the data set changes, including adding or removing slices

    fluid.defaults("gpii.chartAuthoring.pieChart.pie", {
        gradeNames: ["gpii.d3ViewComponent", "autoInit"],
        model: {
            // dataSet accepts:
            // 1. an array of primitive values, such as numbers;
            // 2. an array of objects. The "value" element of each object needs to containe the value for drawing each pie slice.
            // Example: [{id: string, value: number} ... ]
            dataSet: []
        },
        pieOptions: {
            width: 300,
            height: 300,
            // An array of colors to fill slices generated for corresponding values of model.dataSet
            // Or, a d3 color scale that's generated based off an array of colors
            colors: null,
            outerRadius: null,
            innerRadius: null,
            animationDuration: 750
        },
        styles: {
            pie: "gpii-ca-pieChart-pie",
            slice: "gpii-ca-pieChart-slice",
            text: "gpii-ca-pieChart-text"
        },
        selectors: {
            pie: ".gpiic-ca-pieChart-pie",
            slice: ".gpiic-ca-pieChart-slice",
            text: ".gpiic-ca-pieChart-text"
        },
        events: {
            onPieCreated: null  // Fire when the pie is created. Ready to register D3 DOM event listeners
        },
        listeners: {
            "onCreate.create": {
                funcName: "gpii.chartAuthoring.pieChart.pie.create",
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
                funcName: "gpii.chartAuthoring.pieChart.pie.draw",
                args: ["{that}"]
            },
            textTransform: {
                funcName: "gpii.chartAuthoring.pieChart.textTransform",
                args: ["{that}.arc", "{arguments}.0"]
            }
        }
    });

    gpii.chartAuthoring.pieChart.pie.draw = function (that) {
        var svg = that.svg,
            pie = that.pie,
            arc = that.arc,
            color = that.colorScale,
            dataSet = that.model.dataSet,
            sliceClass = that.classes.slice,
            textClass = that.classes.text,
            animationDuration = that.options.pieOptions.animationDuration;

        var paths = svg.selectAll("path")
            .data(pie(dataSet));
        var texts = svg.selectAll("text")
            .data(pie(dataSet));

        // Draw pie slices
        paths.enter()
            .append("path")
            .attr({
                "fill": function(d, i) {
                    return color(i);
                },
                "d": arc,
                "class": sliceClass
            })
            .each(function (d) {
                this._current = d;
            });

        paths.transition().duration(animationDuration).attrTween("d", function (a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return arc(i(t));
            };
        });

        paths.exit().remove();

        // Create texts for pie slices
        texts.enter()
            .append("text")
            .attr({
                "text-anchor": "middle",
                "class": textClass,
                "transform": function (d) {
                    return that.textTransform(d);
                }
            });

        // Update text values
        texts.text(function (d) {
            return d.value;
        });

        texts.transition().duration(animationDuration).attr("transform", function (d) {
            return that.textTransform(d);
        });

        texts.exit().remove();
    };

    gpii.chartAuthoring.pieChart.pie.create = function (that) {
        var container = that.container,
            p = that.options.pieOptions,
            width = p.width,
            height = p.height,
            colors = p.colors,
            outerRadius = p.outerRadius || width / 2,
            innerRadius = p.innerRadius || 0,
            pieClass = that.classes.pie;

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
                "class": pieClass
            })
            .append("g")
            .attr({
                "transform": "translate(" + outerRadius + "," + outerRadius + ")"
            });

        that.colorScale = (typeof(colors) === "function") ? colors : gpii.d3.getColorScale(colors);

        that.draw();

        that.events.onPieCreated.fire();
    };

    gpii.chartAuthoring.pieChart.textTransform = function (arc, d) {
        return "translate(" + arc.centroid(d) + ")";
    };

})(jQuery, fluid);
