/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global JSON */

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.tests.chartAuthoring.transforms");

    gpii.tests.chartAuthoring.transforms.assertTransformation = function (msg, model, transform, expected) {
        var actual = fluid.model.transform(model, transform);
        jqUnit.assertDeepEq(msg, expected, actual);
    };

    gpii.tests.chartAuthoring.transforms.stringToNumberTestCases = {
        transform: {
                transform: {
                type: "gpii.chartAuthoring.transforms.stringToNumber",
                inputPath: "value",
                outputPath: "value"
            }
        },
        models: [{value: "1"}, {value: "1.1"}, {value: 1}, {value: 1.1}, {value: ""}, {value: null}, {}],
        expected: [{value: 1}, {value: 1.1}, {value: 1}, {value: 1.1}, {value: null}, {value: null}, {}]
    };

    jqUnit.test("Test gpii.chartAuthoring.transforms.stringToNumber", function () {
        fluid.each(gpii.tests.chartAuthoring.transforms.stringToNumberTestCases.models, function (model, idx) {
            var expected = gpii.tests.chartAuthoring.transforms.stringToNumberTestCases.expected[idx];
            gpii.tests.chartAuthoring.transforms.assertTransformation("The model '" + JSON.stringify(model) + "' should have been transformed", model, gpii.tests.chartAuthoring.transforms.stringToNumberTestCases.transform, expected);
        });
    });

    gpii.tests.chartAuthoring.transforms.percentageInputs = [undefined, null, NaN, false, true, function () {}, {}, ["array"], "", "string", 2.2, "2.2", 0, "0", 50, 100];
    gpii.tests.chartAuthoring.transforms.percentageOutputs = [
        // values
        // undefined, null, NaN, false, true, function () {}, {}, ["array"], "", "string", 2.2, "2.2", 0, "0", 50, 100
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === undefined
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === null
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === NaN
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === false
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === true
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === function () {}
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === {}
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === []
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === ""
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === "string"
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: 100}, {value: null}, {value: 0}, {value: null}, {value: 2272.7272727272725}, {value: 4545.454545454545}], // total === 2.2
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === "2.2"
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: 0}, {value: null}, {value: 0}, {value: null}, {value: 0}, {value: 0}], // total === 0
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}], // total === "0"
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: 4.4}, {value: null}, {value: 0}, {value: null}, {value: 100}, {value: 200}], // total === 50
        [{value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: null}, {value: 2.2}, {value: null}, {value: 0}, {value: null}, {value: 50}, {value: 100}] // total === 100
    ];

    jqUnit.test("Test gpii.chartAuthoring.transforms.percentage", function () {
        fluid.each(gpii.tests.chartAuthoring.transforms.percentageInputs, function (total, totalIdx) {
            fluid.each(gpii.tests.chartAuthoring.transforms.percentageInputs, function (value, valIdx) {
                var transform = {
                    transform: {
                        type: "gpii.chartAuthoring.transforms.percentage",
                        outputPath: "value",
                        value: value,
                        total: total
                    }
                };
                var expected = gpii.tests.chartAuthoring.transforms.percentageOutputs[totalIdx][valIdx];
                gpii.tests.chartAuthoring.transforms.assertTransformation("The value: '" + value + "' and total: '" + total + "' should have been transformed", {}, transform, expected);
            });
        });
    });
})(jQuery, fluid);
