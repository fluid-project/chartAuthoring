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

    gpii.tests.chartAuthoring.transforms.percentageValidInputs = [0, 2.2, 50, 100];
    gpii.tests.chartAuthoring.transforms.percentageValidOutputs = [
        // values
        // 0, 2.2, 50, 100
        [{value: 0}, {value: 0}, {value: 0}, {value: 0}], // total === 0
        [{value: 0}, {value: 100}, {value: 2272.7272727272725}, {value: 4545.454545454545}], // total === 2.2
        [{value: 0}, {value: 4.4}, {value: 100}, {value: 200}], // total === 50
        [{value: 0}, {value: 2.2}, {value: 50}, {value: 100}] // total === 50
    ];

    gpii.tests.chartAuthoring.transforms.percentageInvalidInputs = [undefined, null, NaN, false, true, function () {}, {}, ["array"], "", "string", "0", "2.2"];

    gpii.tests.chartAuthoring.transforms.testTransforms = function (inputs, outputs) {
        gpii.tests.utils.matrixTest(inputs, function (total, value, totalIdx, valIdx) {
            var transform = {
                transform: {
                    type: "gpii.chartAuthoring.transforms.percentage",
                    outputPath: "value",
                    value: value,
                    total: total
                }
            };
            var expected = fluid.isArrayable(outputs) ? outputs[totalIdx][valIdx] : outputs;
            gpii.tests.chartAuthoring.transforms.assertTransformation("The value: '" + value + "' and total: '" + total + "' should have been transformed", {}, transform, expected);
        });
    };

    jqUnit.test("Test gpii.chartAuthoring.transforms.percentage - valid", function () {
        gpii.tests.chartAuthoring.transforms.testTransforms(gpii.tests.chartAuthoring.transforms.percentageValidInputs, gpii.tests.chartAuthoring.transforms.percentageValidOutputs);
    });

    jqUnit.test("Test gpii.chartAuthoring.transforms.percentage - invalid", function () {
        gpii.tests.chartAuthoring.transforms.testTransforms(gpii.tests.chartAuthoring.transforms.percentageInvalidInputs, {value: null});
    });

    gpii.tests.chartAuthoring.transforms.reduceModel = {
        array: [1, 2],
        obj: {
            a: 3,
            b: 4
        },
        nested: {
            a: {value: 5},
            b: {value: 6}
        }
    };

    gpii.tests.chartAuthoring.transforms.reduceExpected = {
        array1: 3,
        array2: 5,
        obj1: 7,
        obj2: 9,
        nested1: 11,
        nested2: 13
    };

    gpii.tests.chartAuthoring.transforms.reduceTransforms = {
        array1: {
            transform: {
                type: "gpii.chartAuthoring.transforms.reduce",
                value: gpii.tests.chartAuthoring.transforms.reduceModel.array,
                func: "gpii.chartAuthoring.transforms.reduce.add"
            }
        },
        array2: {
            transform: {
                type: "gpii.chartAuthoring.transforms.reduce",
                value: gpii.tests.chartAuthoring.transforms.reduceModel.array,
                initialValue: 2,
                func: "gpii.chartAuthoring.transforms.reduce.add"
            }
        },
        obj1: {
            transform: {
                type: "gpii.chartAuthoring.transforms.reduce",
                value: gpii.tests.chartAuthoring.transforms.reduceModel.obj,
                func: "gpii.chartAuthoring.transforms.reduce.add"
            }
        },
        obj2: {
            transform: {
                type: "gpii.chartAuthoring.transforms.reduce",
                value: gpii.tests.chartAuthoring.transforms.reduceModel.obj,
                initialValue: 2,
                func: "gpii.chartAuthoring.transforms.reduce.add"
            }
        },
        nested1: {
            transform: {
                type: "gpii.chartAuthoring.transforms.reduce",
                value: gpii.tests.chartAuthoring.transforms.reduceModel.nested,
                extractor: "gpii.chartAuthoring.transforms.reduce.valueExtractor",
                func: "gpii.chartAuthoring.transforms.reduce.add"
            }
        },
        nested2: {
            transform: {
                type: "gpii.chartAuthoring.transforms.reduce",
                value: gpii.tests.chartAuthoring.transforms.reduceModel.nested,
                extractor: "gpii.chartAuthoring.transforms.reduce.valueExtractor",
                initialValue: 2,
                func: "gpii.chartAuthoring.transforms.reduce.add"
            }
        }
    };

    jqUnit.test("Test gpii.chartAuthoring.transforms.reduce", function () {
        gpii.tests.chartAuthoring.transforms.assertTransformation("The reduce transforms should have been performed correctly", gpii.tests.chartAuthoring.transforms.reduceModel, gpii.tests.chartAuthoring.transforms.reduceTransforms, gpii.tests.chartAuthoring.transforms.reduceExpected);
    });
})(jQuery, fluid);
