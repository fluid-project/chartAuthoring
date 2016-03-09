/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

// Declare dependencies
/* global JSON */

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.tests.chartAuthoring.transforms");

    floe.tests.chartAuthoring.transforms.assertTransformation = function (msg, model, transform, expected) {
        var actual = fluid.model.transform(model, transform);
        jqUnit.assertDeepEq(msg, expected, actual);
    };

    floe.tests.chartAuthoring.transforms.stringToNumberTestCases = {
        transform: {
            transform: {
                type: "floe.chartAuthoring.transforms.stringToNumber",
                inputPath: "value",
                outputPath: "value"
            }
        },
        models: [{value: "1"}, {value: "1.1"}, {value: 1}, {value: 1.1}, {value: ""}, {value: null}, {}],
        expected: [{value: 1}, {value: 1.1}, {value: 1}, {value: 1.1}, {value: null}, {value: null}, {}]
    };

    jqUnit.test("Test floe.chartAuthoring.transforms.stringToNumber", function () {
        fluid.each(floe.tests.chartAuthoring.transforms.stringToNumberTestCases.models, function (model, idx) {
            var expected = floe.tests.chartAuthoring.transforms.stringToNumberTestCases.expected[idx];
            floe.tests.chartAuthoring.transforms.assertTransformation("The model '" + JSON.stringify(model) + "' should have been transformed", model, floe.tests.chartAuthoring.transforms.stringToNumberTestCases.transform, expected);
        });
    });

    floe.tests.chartAuthoring.transforms.percentageValidInputs = [0, 2.2, 50, 100];
    floe.tests.chartAuthoring.transforms.percentageValidOutputs = [
        // values
        // 0, 2.2, 50, 100
        [{value: 0}, {value: 0}, {value: 0}, {value: 0}], // total === 0
        [{value: 0}, {value: 100}, {value: 2272.7272727272725}, {value: 4545.454545454545}], // total === 2.2
        [{value: 0}, {value: 4.4}, {value: 100}, {value: 200}], // total === 50
        [{value: 0}, {value: 2.2}, {value: 50}, {value: 100}] // total === 50
    ];

    floe.tests.chartAuthoring.transforms.percentageInvalidInputs = [undefined, null, NaN, false, true, function () {}, {}, ["array"], "", "string", "0", "2.2"];

    floe.tests.chartAuthoring.transforms.testTransforms = function (inputs, outputs) {
        floe.tests.utils.matrixTest(inputs, function (total, value, totalIdx, valIdx) {
            var transform = {
                transform: {
                    type: "floe.chartAuthoring.transforms.percentage",
                    outputPath: "value",
                    value: value,
                    total: total
                }
            };
            var expected = fluid.isArrayable(outputs) ? outputs[totalIdx][valIdx] : outputs;
            floe.tests.chartAuthoring.transforms.assertTransformation("The value: '" + value + "' and total: '" + total + "' should have been transformed", {}, transform, expected);
        });
    };

    jqUnit.test("Test floe.chartAuthoring.transforms.percentage - valid", function () {
        floe.tests.chartAuthoring.transforms.testTransforms(floe.tests.chartAuthoring.transforms.percentageValidInputs, floe.tests.chartAuthoring.transforms.percentageValidOutputs);
    });

    jqUnit.test("Test floe.chartAuthoring.transforms.percentage - invalid", function () {
        floe.tests.chartAuthoring.transforms.testTransforms(floe.tests.chartAuthoring.transforms.percentageInvalidInputs, {value: null});
    });

    floe.tests.chartAuthoring.transforms.reduceModel = {
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

    floe.tests.chartAuthoring.transforms.reduceExpected = {
        array1: 3,
        array2: 5,
        obj1: 7,
        obj2: 9,
        nested1: 11,
        nested2: 13
    };

    floe.tests.chartAuthoring.transforms.reduceTransforms = {
        array1: {
            transform: {
                type: "floe.chartAuthoring.transforms.reduce",
                value: floe.tests.chartAuthoring.transforms.reduceModel.array,
                func: "floe.chartAuthoring.transforms.reduce.add"
            }
        },
        array2: {
            transform: {
                type: "floe.chartAuthoring.transforms.reduce",
                value: floe.tests.chartAuthoring.transforms.reduceModel.array,
                initialValue: 2,
                func: "floe.chartAuthoring.transforms.reduce.add"
            }
        },
        obj1: {
            transform: {
                type: "floe.chartAuthoring.transforms.reduce",
                value: floe.tests.chartAuthoring.transforms.reduceModel.obj,
                func: "floe.chartAuthoring.transforms.reduce.add"
            }
        },
        obj2: {
            transform: {
                type: "floe.chartAuthoring.transforms.reduce",
                value: floe.tests.chartAuthoring.transforms.reduceModel.obj,
                initialValue: 2,
                func: "floe.chartAuthoring.transforms.reduce.add"
            }
        },
        nested1: {
            transform: {
                type: "floe.chartAuthoring.transforms.reduce",
                value: floe.tests.chartAuthoring.transforms.reduceModel.nested,
                extractor: "floe.chartAuthoring.transforms.reduce.valueExtractor",
                func: "floe.chartAuthoring.transforms.reduce.add"
            }
        },
        nested2: {
            transform: {
                type: "floe.chartAuthoring.transforms.reduce",
                value: floe.tests.chartAuthoring.transforms.reduceModel.nested,
                extractor: "floe.chartAuthoring.transforms.reduce.valueExtractor",
                initialValue: 2,
                func: "floe.chartAuthoring.transforms.reduce.add"
            }
        }
    };

    jqUnit.test("Test floe.chartAuthoring.transforms.reduce", function () {
        floe.tests.chartAuthoring.transforms.assertTransformation("The reduce transforms should have been performed correctly", floe.tests.chartAuthoring.transforms.reduceModel, floe.tests.chartAuthoring.transforms.reduceTransforms, floe.tests.chartAuthoring.transforms.reduceExpected);
    });
})(jQuery, fluid);
