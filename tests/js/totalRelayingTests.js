/*
Copyright 2015 OCAD University

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

    jqUnit.test("Test total relaying for pie/legend-style dataset", function () {
        jqUnit.expect(2);

        var that = floe.tests.chartAuthoring.totalRelaying({
            model: {
                dataSet: floe.tests.chartAuthoring.totalRelaying.arrayDataSet
            }
        });

        jqUnit.assertEquals("Relayed total is expected value", floe.tests.chartAuthoring.totalRelaying.expectedArrayDataSetTotal, that.model.total.value);
        jqUnit.assertEquals("Relayed percentage is expected value", floe.tests.chartAuthoring.totalRelaying.expectedPercentageValue, that.model.total.percentage);
    });

    jqUnit.test("Test total relaying for data entry panel-style dataset", function () {
        jqUnit.expect(2);

        var that = floe.tests.chartAuthoring.totalRelaying({
            model: {
                dataSet: floe.tests.chartAuthoring.totalRelaying.objectDataset
            }
        });

        jqUnit.assertEquals("Relayed total is expected value", floe.tests.chartAuthoring.totalRelaying.expectedObjectDataSetTotal, that.model.total.value);
        jqUnit.assertEquals("Relayed percentage is expected value", floe.tests.chartAuthoring.totalRelaying.expectedPercentageValue, that.model.total.percentage);
    });

})(jQuery, fluid);
