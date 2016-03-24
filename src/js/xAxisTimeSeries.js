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

    // Mix-in grade for time-series x axis

    fluid.defaults("floe.chartAuthoring.xAxisTimeSeries", {
        model: {
            dataSet: []
        },
        bindings: {
            title: "svgTitle",
            description: "svgDescription"
        },
        svgOptions: {
            width: 700,
            height: 500
        },
        lineOptions: {
            numberOfXAxisTicks: 6
        },
        selectors: {
            xAxis: ".floec-ca-lineChart-x-axis"
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
                funcName: "floe.chartAuthoring.xAxisTimeSeries.drawXAxis",
                args: ["{that}"]
            }
        }
    });

    floe.chartAuthoring.xAxisTimeSeries.drawXAxis = function (that) {
        var xAxisClass = that.classes.xAxis,
            padding = that.options.lineOptions.padding,
            height = that.options.svgOptions.height,
            axisTransform = "translate(0," + (height - padding) + ")",
            xAxis = floe.chartAuthoring.xAxisTimeSeries.getXAxis(that);

        that.manageAxis("xAxis", xAxisClass, axisTransform, xAxis);
    };

    floe.chartAuthoring.xAxisTimeSeries.getXAxis = function (that) {
        var xScale = that.getXScale(),
            numberOfXAxisTicks = that.options.lineOptions.numberOfXAxisTicks;

        var xAxis = d3.svg.axis()
            .tickFormat(floe.chartAuthoring.xAxisTimeSeries.getXAxisTickFormat())
            .ticks(numberOfXAxisTicks)
            .orient("bottom")
            .scale(xScale);

        return xAxis;

    };

    floe.chartAuthoring.xAxisTimeSeries.getXAxisTickFormat = function () {
        // See https://github.com/mbostock/d3/wiki/Time-Formatting for
        // explanation of how time formatting works in D3
        var customTickFormat = d3.time.format.multi([
            [".%L", function (d) { return d.getMilliseconds(); }],
            [":%S", function (d) { return d.getSeconds(); }],
            ["%I:%M", function (d) { return d.getMinutes(); }],
            ["%I %p", function (d) { return d.getHours(); }],
            ["%a %d", function (d) { return d.getDay() && d.getDate() !== 1; }],
            ["%b %d", function (d) { return d.getDate() !== 1; }],
            ["%b", function (d) { return d.getMonth(); }],
            ["%Y", function () { return true; }]
        ]);

        return customTickFormat;
    };

})(jQuery, fluid);
