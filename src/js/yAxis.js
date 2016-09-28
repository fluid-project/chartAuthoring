/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt

TODO: the yAxis & other chart elements should be moved away from being mix-in
grades to increase composability, per this JIRA: https://issues.fluidproject.org/browse/FLOE-473
*/

/* global fluid, floe, d3 */

(function ($, fluid) {

    "use strict";

    // Mix-in grade for value-based y axis
    // should be used alongside the floe.chartAuthoring.axis
    // grade in charts that require a value-based y axis

    fluid.defaults("floe.chartAuthoring.yAxis", {
        model: {
            dataSet: []
        },
        selectors: {
            yAxis: ".floec-ca-lineChart-y-axis"
        },
        styles: {
            yAxis: "floe-ca-lineChart-y-axis"
        },
        axisOptions: {
            numberOfYAxisTicks: 10,
            // See https://github.com/mbostock/d3/wiki/Formatting#d3_format for
            // number formatting in D3
            // This default formats to whole integers only
            yAxisTickFormat: "d"
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
            },
            getYAxisTickFormat: {
                funcName: "floe.chartAuthoring.yAxis.getYAxisTickFormat",
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
        var numberOfYAxisTicks = that.options.axisOptions.numberOfYAxisTicks;

        var yAxis = d3.svg.axis()
            .orient("left")
            .scale(yScale)
            .tickFormat(that.getYAxisTickFormat())
            .ticks(numberOfYAxisTicks)
            .innerTickSize(-width + padding * 3)
            .outerTickSize(0)
            .tickPadding(10);

        return yAxis;
    };

    floe.chartAuthoring.yAxis.getYAxisTickFormat = function (that) {
        var yAxisTickFormat = that.options.axisOptions.yAxisTickFormat;
        return d3.format(yAxisTickFormat);
    };

})(jQuery, fluid);
