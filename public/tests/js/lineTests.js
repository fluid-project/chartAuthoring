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
        gradeNames: ["floe.chartAuthoring.lineChart.chart", "autoInit"]
    });

    floe.tests.chartAuthoring.timeSeriesData1 = [
        {
            "date": "2014-12-31",
            "value": 45
        },
        {
            "date": "2015-01-07",
            "value": 24
        },
        {
            "date": "2015-01-14",
            "value": 31
        },
        {
            "date": "2015-01-21",
            "value": 36
        },
        {
            "date": "2015-01-28",
            "value": 40
        },
        {
            "date": "2015-02-04",
            "value": 14
        },
        {
            "date": "2015-02-11",
            "value": 12
        },
        {
            "date": "2015-02-18",
            "value": 8
        },
        {
            "date": "2015-02-25",
            "value": 49
        },
        {
            "date": "2015-03-04",
            "value": 6
        },
        {
            "date": "2015-03-11",
            "value": 31
        },
        {
            "date": "2015-03-18",
            "value": 11
        },
        {
            "date": "2015-03-25",
            "value": 46
        },
        {
            "date": "2015-04-01",
            "value": 7
        },
        {
            "date": "2015-04-08",
            "value": 5
        },
        {
            "date": "2015-04-15",
            "value": 33
        },
        {
            "date": "2015-04-22",
            "value": 12
        },
        {
            "date": "2015-04-29",
            "value": 35
        },
        {
            "date": "2015-05-06",
            "value": 17
        },
        {
            "date": "2015-05-13",
            "value": 23
        },
        {
            "date": "2015-05-20",
            "value": 45
        },
        {
            "date": "2015-05-27",
            "value": 7
        },
        {
            "date": "2015-06-03",
            "value": 25
        },
        {
            "date": "2015-06-10",
            "value": 18
        },
        {
            "date": "2015-06-17",
            "value": 19
        },
        {
            "date": "2015-06-24",
            "value": 45
        }
    ];

    floe.tests.chartAuthoring.timeSeriesData2 = [
        {
            "date": "2015-05-31",
            "value": 22
        },
        {
            "date": "2015-06-07",
            "value": 17
        },
        {
            "date": "2015-06-14",
            "value": 47
        },
        {
            "date": "2015-06-21",
            "value": 34
        },
        {
            "date": "2015-06-28",
            "value": 47
        },
        {
            "date": "2015-07-05",
            "value": 31
        },
        {
            "date": "2015-07-12",
            "value": 30
        },
        {
            "date": "2015-07-19",
            "value": 27
        },
        {
            "date": "2015-07-26",
            "value": 18
        },
        {
            "date": "2015-08-02",
            "value": 28
        },
        {
            "date": "2015-08-09",
            "value": 28
        },
        {
            "date": "2015-08-16",
            "value": 9
        },
        {
            "date": "2015-08-23",
            "value": 21
        },
        {
            "date": "2015-08-30",
            "value": 45
        },
        {
            "date": "2015-09-06",
            "value": 21
        },
        {
            "date": "2015-09-13",
            "value": 10
        },
        {
            "date": "2015-09-20",
            "value": 23
        },
        {
            "date": "2015-09-27",
            "value": 5
        },
        {
            "date": "2015-10-04",
            "value": 47
        },
        {
            "date": "2015-10-11",
            "value": 31
        },
        {
            "date": "2015-10-18",
            "value": 46
        },
        {
            "date": "2015-10-25",
            "value": 13
        },
        {
            "date": "2015-11-01",
            "value": 50
        },
        {
            "date": "2015-11-08",
            "value": 16
        },
        {
            "date": "2015-11-15",
            "value": 11
        },
        {
            "date": "2015-11-22",
            "value": 37
        }
    ];

    jqUnit.test("Test line chart creation", function () {

        jqUnit.expect(4);

        var that = floe.tests.chartAuthoring.lineChart.line(".floec-ca-lineChart", {
            model: {
                dataSet: floe.tests.chartAuthoring.timeSeriesData1
            }
        });

        var line = that.locate("svg"),
            lineTitleId = that.locate("title").attr("id"),
            lineDescId = that.locate("description").attr("id"),
            lineAriaLabelledByAttr = line.attr("aria-labelledby");

        // Test the SVG element created
        jqUnit.assertNotEquals("The SVG element is created with the proper selector", 0, line.length);

        jqUnit.assertEquals("The line's title has been created", that.model.svgTitle, that.locate("title").text());

        jqUnit.assertEquals("The line's description has been created", that.model.svgDescription, that.locate("description").text());

        jqUnit.assertDeepEq("The line's title and description are connected through the aria-labelledby attribute of the line SVG", lineAriaLabelledByAttr, lineTitleId + " " + lineDescId);

        // that.applier.change("dataSet", floe.tests.chartAuthoring.timeSeriesData2);


    });

})(jQuery, fluid);
