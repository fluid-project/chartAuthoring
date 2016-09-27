/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* global fluid, floe, d3 */

(function ($, fluid) {

    "use strict";

    // Mix-in grade for value-based x axis
    // should be used alongside the floe.chartAuthoring.axis
    // grade in charts that require a value-based x axis

    fluid.defaults("floe.chartAuthoring.xAxis", {
        model: {
            dataSet: []
        },
        axisOptions: {
            numberOfXAxisTicks: 6,
            // See https://github.com/mbostock/d3/wiki/Formatting#d3_format for
            // number formatting in D3
            // This default formats to whole integers only
            xAxisTickFormat: "d"
        },
        selectors: {
            xAxis: ".floec-ca-lineChart-x-axis"
        },
        styles: {
            xAxis: "floe-ca-lineChart-x-axis"
        },
        events: {
            onChartCreated: null,  // Fire when the line is created. Ready to register D3 DOM event listeners,
            onDraw: null
        },
        listeners: {
            "onDraw.drawXAxis": {
                func: "{that}.drawXAxis",
                priority: "before:drawChartLine"
            }
        },
        invokers: {
            drawXAxis: {
                funcName: "floe.chartAuthoring.xAxis.drawXAxis",
                args: ["{that}"]
            },
            getXAxisTickFormat: {
                funcName: "floe.chartAuthoring.xAxis.getXAxisTickFormat",
                args: ["{that}"]
            }
        }
    });

    floe.chartAuthoring.xAxis.drawXAxis = function (that) {
        var xAxisClass = that.classes.xAxis,
            padding = that.options.lineOptions.padding,
            height = that.options.svgOptions.height,
            axisTransform = "translate(0," + (height - padding) + ")",
            xAxis = floe.chartAuthoring.xAxis.getXAxis(that);

        that.manageAxis("xAxis", xAxisClass, axisTransform, xAxis);
    };

    floe.chartAuthoring.xAxis.getXAxis = function (that) {
        var xScale = that.getXScale(),
            numberOfXAxisTicks = that.options.axisOptions.numberOfXAxisTicks;

        var xAxis = d3.svg.axis()
            .tickFormat(that.getXAxisTickFormat())
            .ticks(numberOfXAxisTicks)
            .orient("bottom")
            .scale(xScale);

        return xAxis;

    };

    floe.chartAuthoring.xAxis.getXAxisTickFormat = function (that) {
        var xAxisTickFormat = that.options.axisOptions.xAxisTickFormat;
        return d3.format(xAxisTickFormat);
    };

})(jQuery, fluid);
