/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    // Mix-in grade for y axis

    fluid.defaults("floe.chartAuthoring.yAxis", {
        model: {
            dataSet: []
        },
        selectors: {
            yAxis: ".floec-ca-lineChart-y-axis"
        },
        events: {
            onChartCreated: null,  // Fire when the line is created. Ready to register D3 DOM event listeners,
            onDraw: null
        },
        listeners: {
            "onDraw.drawYAxis": {
                func: "{that}.drawYAxis",
                priority: "before:drawChartLine"
            }
        },
        invokers: {
            drawYAxis: {
                funcName: "floe.chartAuthoring.yAxis.drawYAxis",
                args: ["{that}"]
            }
        }
    });

    floe.chartAuthoring.yAxis.drawYAxis = function (that) {
        var yAxisClass = that.classes.yAxis,
            padding = that.options.lineOptions.padding,
            axisTransform = "translate(" + padding + ",0)",
            yAxis = floe.chartAuthoring.yAxis.getYAxis(that);

        that.manageAxis("yAxis", yAxisClass, axisTransform, yAxis);

    };

    floe.chartAuthoring.yAxis.getYAxis = function (that) {
        var width = that.options.svgOptions.width;
        var padding = that.options.lineOptions.padding;
        var yScale = that.getYScale();

        var yAxis = d3.svg.axis()
            .orient("left")
            .scale(yScale)
            .innerTickSize(- width + padding * 3)
            .outerTickSize(0)
            .tickPadding(10);

        return yAxis;
    };

})(jQuery, fluid);
