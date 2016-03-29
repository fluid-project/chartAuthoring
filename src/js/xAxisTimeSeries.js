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
    // should be used alongside the floe.chartAuthoring.axis
    // and floe.chartAuthoring.xAxis grades
    // in charts that require a time-based x axis

    fluid.defaults("floe.chartAuthoring.xAxisTimeSeries", {
        gradeNames: ["floe.chartAuthoring.xAxis"],
        model: {
            dataSet: []
        },
        invokers: {
            getXAxisTickFormat: {
                funcName: "floe.chartAuthoring.xAxisTimeSeries.getXAxisTickFormat"
            }
        }
    });

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
