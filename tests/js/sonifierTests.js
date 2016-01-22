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

    fluid.defaults("floe.tests.chartAuthoring.sonifier", {
        gradeNames: ["floe.chartAuthoring.sonifier", "autoInit"]
    });

    floe.tests.chartAuthoring.dataSet =
    {
        entry1: {
            value: 100,
            label: "Label One"
        },
        entry2: {
            value: 50,
            label: "Label Two"
        }
    };

    floe.tests.chartAuthoring.sonificationData =
    [
        {
            id: "entry1",
            units: [10,10,10,10,10,10,1,1,1,1,1,1,1],
            envelope: {
                durations: [1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [3/8, 3/8, 3/8, 3/8, 3/8, 3/8, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8],
                values: [91, 91, 91, 91, 91, 91, 89, 89, 89, 89, 89, 89, 89]
            },
            percentage:67,
            value: 100,
            label: "Label One"
        },
        {
            id: "entry2",
            units: [10,10,10,1,1,1],
            envelope: {
                durations: [1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [3/8, 3/8, 3/8, 1/8, 1/8, 1/8],
                values: [91, 91, 91, 89, 89, 89]
            },
            percentage:33,
            value: 50,
            label: "Label Two"
        }
    ];

    jqUnit.test("Test the behaviour of the sonification", function () {
        jqUnit.expect(1);

        var that = floe.tests.chartAuthoring.sonifier({
            model: {
                dataSet: floe.tests.chartAuthoring.dataSet
            }
        });

        jqUnit.assertDeepEq("Sonifier's dataset is converted into the expected sonification", floe.tests.chartAuthoring.sonificationData, that.model.sonifiedData);

        that.playSonification();

    });
})(jQuery, fluid);
