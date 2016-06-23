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

    fluid.defaults("floe.tests.chartAuthoring.lineChart.timeSeriesSingleDataSet", {
        gradeNames: ["floe.chartAuthoring.lineChart.timeSeriesSingleDataSet"],
        svgOptions: {
            height: 400,
            width: 800
        }
    });

    fluid.defaults("floe.tests.chartAuthoring.lineChart.timeSeriesMultiDataSet", {
        gradeNames: ["floe.chartAuthoring.lineChart.timeSeriesMultiDataSet"],
        svgOptions: {
            height: 400,
            width: 800
        }
    });

    fluid.defaults("floe.tests.chartAuthoring.lineChart.fixtureDataTester", {
        gradeNames: "fluid.resourceLoader",
        resources: {
            timeSeriesData1: "../json/timeSeriesData1.json",
            timeSeriesData2: "../json/timeSeriesData2.json",
            timeSeriesDataMulti: "../json/timeSeriesDataMulti.json"
        },
        listeners: {
            "onResourcesLoaded.runLineChartFixtureTests": {
                func: "floe.tests.chartAuthoring.lineChart.runLineChartFixtureTests",
                args: "{that}"
            }
        }
    });

    floe.tests.chartAuthoring.validateLine = function (that, expectedDataSet) {

        // Test that the chart line is created

        var chartLines = that.locate("chartLine");

        fluid.each(chartLines, function (chartLine, idx) {
            jqUnit.assertNotEquals("The chart line element is created with the proper selector", 0, chartLine.length);

            floe.tests.chartAuthoring.validateBoundData(chartLine, expectedDataSet[idx].data);
        });
    };

    // Given a single element expected to have bound data and an expected
    // dataset, checks that the data is bound and matches the dataset
    floe.tests.chartAuthoring.validateBoundData = function (boundElement,  expectedDataSet) {

        var boundElementData = boundElement.__data__ !== undefined ? boundElement.__data__.data : boundElement[0].__data__.data;

        jqUnit.assertEquals("The length of the bound data is the same as that of the expected dataset", expectedDataSet.length, boundElementData.length);

        fluid.each(expectedDataSet, function (dataPoint, idx) {
            jqUnit.assertDeepEq("dataPoint from dataSet at position " + idx + " has a matching object in the line's bound data", dataPoint, boundElementData[idx]);
        });
    };

    floe.tests.chartAuthoring.validateLineChart = function (that, expectedDataSet) {
        // Test the base chart SVG element created
        var chart = that.locate("svg"),
            lineTitleId = that.locate("title").attr("id"),
            lineDescId = that.locate("description").attr("id"),
            lineAriaLabelledByAttr = chart.attr("aria-labelledby");

        jqUnit.assertNotEquals("The SVG element is created with the proper selector", 0, chart.length);

        jqUnit.assertEquals("The line's title has been created", that.model.svgTitle, that.locate("title").text());

        jqUnit.assertEquals("The line's description has been created", that.model.svgDescription, that.locate("description").text());

        jqUnit.assertDeepEq("The line's title and description are connected through the aria-labelledby attribute of the line SVG", lineAriaLabelledByAttr, lineTitleId + " " + lineDescId);

        // Test that the y-axis is created
        var yAxis = that.locate("yAxis");

        jqUnit.assertNotEquals("The y-axis element is created with the proper selector", 0, yAxis.length);

        // Test that the x-axis is created
        var xAxis = that.locate("xAxis");

        jqUnit.assertNotEquals("The x-axis element is created with the proper selector", 0, xAxis.length);

        floe.tests.chartAuthoring.validateLine(that, expectedDataSet);
    };

    floe.tests.chartAuthoring.validateLineChartArea = function (that) {
        // Test that the area is created
        var chartLineAreas = that.locate("chartLineArea");

        jqUnit.assertNotEquals("The chart area element is created with the proper selector", 0, chartLineAreas.length);

        fluid.each(chartLineAreas, function (chartLineArea, idx) {
            floe.tests.chartAuthoring.validateBoundData(chartLineArea, that.model.dataSet[idx].data);
        });
    };

    floe.tests.chartAuthoring.validateLineChartPoints = function (that) {
        var chartLinePointGroups = that.locate("chartLinePointGroup");

        jqUnit.assertNotEquals("The chart line point group element is created with the proper selector", 0, chartLinePointGroups.length);

        fluid.each(chartLinePointGroups, function (chartLinePointGroup, idx) {
            var chartLinePointElements = $(chartLinePointGroup).children("circle");
            fluid.each(that.model.dataSet[idx].data, function (dataPoint, idx) {
                jqUnit.assertDeepEq("dataPoint from dataSet at position " + idx + " has a matching object in the line's bound data", dataPoint, chartLinePointElements[idx].__data__);
            });
        });
    };

    // Test wrapper function, runs after fixtures are loaded from file
    floe.tests.chartAuthoring.lineChart.runLineChartFixtureTests = function (fixtureTester) {

        var timeSeriesData1 = JSON.parse(fixtureTester.resources.timeSeriesData1.resourceText);

        var timeSeriesData2 = JSON.parse(fixtureTester.resources.timeSeriesData2.resourceText);

        var timeSeriesDataMulti = JSON.parse(fixtureTester.resources.timeSeriesDataMulti.resourceText);

        jqUnit.test("Test line chart creation and response to changed data", function () {
            jqUnit.expect(68);
            var that = floe.tests.chartAuthoring.lineChart.timeSeriesSingleDataSet(".floec-ca-lineChart", {
                model: {
                    dataSet: timeSeriesData1
                }
            });

            floe.tests.chartAuthoring.validateLineChart(that, that.model.dataSet);

            that.applier.change("dataSet", timeSeriesData2);

            floe.tests.chartAuthoring.validateLineChart(that, that.model.dataSet);
        });

        jqUnit.test("Test line chart creation with area and data points enabled", function () {
            jqUnit.expect(178);
            var that = floe.tests.chartAuthoring.lineChart.timeSeriesSingleDataSet(".floec-ca-lineChart-area", {
                gradeNames: [
                    "floe.chartAuthoring.lineChart.timeSeries.area", "floe.chartAuthoring.lineChart.timeSeries.points"
                ],
                model: {
                    dataSet: timeSeriesData1
                },
                lineOptions: {
                    interpolation: "cardinal"
                }
            });

            floe.tests.chartAuthoring.validateLineChart(that, that.model.dataSet);

            floe.tests.chartAuthoring.validateLineChartArea(that);

            floe.tests.chartAuthoring.validateLineChartPoints(that);

            that.applier.change("dataSet", timeSeriesData2);

            floe.tests.chartAuthoring.validateLineChart(that, that.model.dataSet);

            floe.tests.chartAuthoring.validateLineChartArea(that);

            floe.tests.chartAuthoring.validateLineChartPoints(that);

        });

        jqUnit.test("Test line chart with multiple lines", function () {
            jqUnit.expect(172);
            var that = floe.tests.chartAuthoring.lineChart.timeSeriesMultiDataSet(".floec-ca-lineChart-multi", {
                gradeNames: [
                    "floe.chartAuthoring.lineChart.timeSeries.area"
                ],
                model: {
                    dataSet: timeSeriesDataMulti
                },
                lineOptions: {
                    interpolation: "step"
                }
            });

            floe.tests.chartAuthoring.validateLineChart(that, that.model.dataSet);

            floe.tests.chartAuthoring.validateLineChartArea(that);

        });
    };

    floe.tests.chartAuthoring.lineChart.fixtureDataTester();


})(jQuery, fluid);
