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
    // 1. able to draw a pie based on the data set and pie options
    // 2. able to register D3 DOM event listeners
    // 3. extend the input data set structure to accept an array of objects as long as objects contain a "value" element for drawing the pie slice
    // 4. able to configure the color of each pie slice
    // 5. update the pie when the data set changes, including adding or removing slices

    fluid.defaults("gpii.chartAuthoring.pieChart.pie", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
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
            colors: null, // An array of colors to fill slices generated for corresponding values from options.dataSet
            outerRadius: null,
            innerRadius: null,
            animationDuration: 750
        },
        // The class names to be
        classNames: {
            pie: "gpiic-ca-pieChart-pie gpii-ca-pieChart-pie",
            slice: "gpiic-ca-pieChart-slice gpii-ca-pieChart-slice",
            text: "gpiic-ca-pieChart-text gpii-ca-pieChart-text"
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
            jQueryDomToD3Dom: {
                funcName: "gpii.chartAuthoring.pieChart.pie.jQueryDomToD3Dom",
                args: ["{arguments}.0"]
            },
            addD3Listeners: {
                funcName: "gpii.chartAuthoring.pieChart.pie.addD3Listeners",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            draw: {
                funcName: "gpii.chartAuthoring.pieChart.pie.draw",
                args: ["{that}"]
            }
        }
    });

    /**
     * Convert jQuery DOM elements to D3 DOM elements.
     * @param domElem - a jQuery DOM element or an array of jQuery DOM elements
     */
    gpii.chartAuthoring.pieChart.pie.jQueryDomToD3Dom = function (domElem) {
        return d3.selectAll(domElem.toArray());
    };

    gpii.chartAuthoring.pieChart.pie.addD3Listeners = function (that, elem, eventName, listener) {
        var d3Elem = that.jQueryDomToD3Dom(elem);
        d3Elem.on(eventName, function (data, i) {
            fluid.invokeGlobalFunction(listener, [data, i, that]);
        });
    };

    gpii.chartAuthoring.pieChart.pie.draw = function (that) {
        var svg = that.svg,
            pie = that.pie,
            arc = that.arc,
            color = that.color,
            dataSet = that.model.dataSet,
            sliceSelector = that.options.classNames.slice,
            textSelector = that.options.classNames.text,
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
                "class": sliceSelector
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

        // Draw texts for pie slices
        texts.enter()
            .append("text")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr({
                "text-anchor": "middle",
                "class": textSelector
            })
            .text(function(d) {
                return d.value;
            });

        texts.transition().duration(animationDuration).attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        });

        texts.exit().remove();
    };

    gpii.chartAuthoring.pieChart.pie.create = function (that) {
        var container = that.container,
            dataSet = that.model.dataSet,
            width = that.options.pieOptions.width,
            height = that.options.pieOptions.height,
            colors = that.options.pieOptions.colors,
            outerRadius = that.options.pieOptions.outerRadius || width / 2,
            innerRadius = that.options.pieOptions.innerRadius || 0,
            pieSelector = that.options.classNames.pie;

        if (dataSet.length === 0) {
            return;
        }

        that.arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        that.pie = d3.layout.pie()
            .value(function (d) {
                return typeof (d) === "object" ? d.value : d;
            });

        //Easy colors accessible via a 10-step ordinal scale
        that.color = colors ? d3.scale.ordinal().range(colors) : d3.scale.category10();

        //Create SVG element
        that.svg = that.jQueryDomToD3Dom(container)
            .append("svg")
            .attr({
                "width": width,
                "height": height,
                "class": pieSelector
            })
            .append("g")
            .attr({
                "transform": "translate(" + outerRadius + "," + outerRadius + ")"
            });

        that.draw(that);

        that.events.onPieCreated.fire();
    };

})(jQuery, fluid);
