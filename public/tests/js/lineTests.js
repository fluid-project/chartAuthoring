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

    fluid.registerNamespace("floe.tests.chartAuthoring");

    fluid.defaults("floe.tests.chartAuthoring.lineChart.line", {
        gradeNames: ["floe.chartAuthoring.lineChart.line", "autoInit"]
    });

    floe.tests.chartAuthoring.timeSeriesData1 = [
        {
            date: "2015-01-01",
            value: 17
        },
        {
            date: "2015-02-01",
            value: 8
        },
        {
            date: "2015-03-01",
            value: 36
        },
        {
            date: "2015-04-01",
            value: 12
        },
        {
            date: "2015-05-01",
            value: 22
        },
        {
            date: "2015-06-01",
            value: 29
        },
        {
            date: "2015-07-01",
            value: 15
        },
        {
            date: "2015-08-01",
            value: 17
        },
        {
            date: "2015-09-01",
            value: 19
        },
        {
            date: "2015-10-01",
            value: 46
        },
        {
            date: "2015-11-01",
            value: 44
        },
        {
            date: "2015-12-01",
            value: 24
        }
    ];

    floe.tests.chartAuthoring.timeSeriesData2 = [
        {
            date: "2011",
            value: 170
        },
        {
            date: "2012",
            value: 80
        },
        {
            date: "2013",
            value: 360
        },
        {
            date: "2014",
            value: 120
        },
        {
            date: "2015",
            value: 220
        }
    ];

    jqUnit.test("Test line chart creation", function () {

        var that = floe.tests.chartAuthoring.lineChart.line(".floec-ca-lineChart", {
            model: {
                dataSet: floe.tests.chartAuthoring.timeSeriesData1
            }
        });

        // that.applier.change("dataSet", floe.tests.chartAuthoring.timeSeriesData2);


    });

})(jQuery, fluid);
