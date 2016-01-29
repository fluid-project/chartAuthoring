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

    fluid.defaults("floe.tests.chartAuthoring.totalRelaying", {
        gradeNames: ["floe.chartAuthoring.totalRelaying", "autoInit"]
    });

    floe.tests.chartAuthoring.totalRelaying.arrayDataSet =
    [
        {
            id: "entry1",
            value: 100,
            label: "Label One"
        },
        {
            id: "entry2",
            value: 50,
            label: "Label Two"
        }
    ];

    floe.tests.chartAuthoring.totalRelaying.expectedArrayDataSetTotal = 150;

    floe.tests.chartAuthoring.totalRelaying.objectDataset =
    {
        entry1: {
            value: 200,
            label: "Label One"
        },
        entry2: {
            value: 75,
            label: "Label Two"
        }
    };

    floe.tests.chartAuthoring.totalRelaying.expectedObjectDataSetTotal = 275;

    // Should always be 100 (100%)
    floe.tests.chartAuthoring.totalRelaying.expectedPercentageValue = 100;

    floe.tests.chartAuthoring.totalRelaying.testRelay = function (expectedTotal, dataset) {
        jqUnit.expect(2);
        var that = floe.tests.chartAuthoring.totalRelaying({
            model: {
                dataSet: dataset
            }
        });

        jqUnit.assertEquals("Relayed total is expected value", expectedTotal.value);
        jqUnit.assertEquals("Relayed percentage is expected value", floe.tests.chartAuthoring.totalRelaying.expectedPercentageValue, that.model.total.percentage);
    };

    jqUnit.test("Test total relaying for pie/legend-style dataset", function () {
        floe.tests.chartAuthoring.totalRelaying.testRelay(floe.tests.chartAuthoring.totalRelaying.expectedArrayDataSetTotal, floe.tests.chartAuthoring.totalRelaying.arrayDataSet);
    });

    jqUnit.test("Test total relaying for data entry panel-style dataset", function () {
        floe.tests.chartAuthoring.totalRelaying.testRelay(floe.tests.chartAuthoring.totalRelaying.expectedObjectDataSetTotal, floe.tests.chartAuthoring.totalRelaying.objectDataset);
    });

})(jQuery, fluid);
