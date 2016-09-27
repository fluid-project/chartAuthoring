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

    // Mix-in grade for time-series x axis
    // should be used alongside the floe.chartAuthoring.axis
    // and floe.chartAuthoring.xAxis grades
    // in charts that require a time-based x axis

    fluid.defaults("floe.chartAuthoring.xAxisTimeSeries", {
        gradeNames: ["floe.chartAuthoring.xAxis"],
        model: {
            dataSet: []
        },
        axisOptions: {
            // Configures the time formatting of the axis ticks
            // in the getXAxisTickFormat function
            // See https://github.com/mbostock/d3/wiki/Time-Formatting for
            // explanation of how time formatting works in D3
            // and https://github.com/mbostock/d3/wiki/Time-Scales#tickFormat
            // for how it works in the context of a time-based scale
            //
            // This formatting is identical to the default described at
            // https://github.com/d3/d3/wiki/Time-Formatting#format_multi
            // with the exception that 'month' uses the 3-character
            // month name shorthand rather than the full name
            XAxisTimeSeriesTickFormats: {
                milliseconds: "%.L",
                seconds: ":%S",
                minute: "%I:%M",
                hour: "%I %p",
                day: "%a %d",
                firstDayOfMonth: "%b %d",
                month: "%b",
                year: "%Y"
            }
        },
        invokers: {
            getXAxisTickFormat: {
                funcName: "floe.chartAuthoring.xAxisTimeSeries.getXAxisTickFormat",
                args: ["{that}"]
            }
        }
    });

    floe.chartAuthoring.xAxisTimeSeries.getXAxisTickFormat = function (that) {

        var tickFormats = that.options.axisOptions.XAxisTimeSeriesTickFormats;

        // See https://github.com/d3/d3/wiki/Time-Formatting#format_multi
        // Tick formats are configured in axisOptions.XAxisTimeSeriesTickFormats
        var customTickFormat = d3.time.format.multi([
            [tickFormats.milliseconds, function (d) { return d.getMilliseconds(); }],
            [tickFormats.seconds, function (d) { return d.getSeconds(); }],
            [tickFormats.minute, function (d) { return d.getMinutes(); }],
            [tickFormats.hour, function (d) { return d.getHours(); }],
            [tickFormats.day, function (d) { return d.getDay() && d.getDate() !== 1; }],
            [tickFormats.firstDayOfMonth, function (d) { return d.getDate() !== 1; }],
            [tickFormats.month, function (d) { return d.getMonth(); }],
            [tickFormats.year, function () { return true; }]
        ]);

        return customTickFormat;
    };

})(jQuery, fluid);
