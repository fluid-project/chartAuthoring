/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.tests.chartAuthoring.valueBinding", {
        gradeNames: ["gpii.chartAuthoring.valueBinding"],
        selectors: {
            unidirectional: "label",
            bidirectional: "input"
        },
        model: {
            val1: "foo",
            nested: {
                val2: "bar"
            }
        },
        bindings: {
            unidirectional: "val1",
            bidirectional: "nested.val2"
        }
    });

    fluid.defaults("gpii.tests.chartAuthoring.valueBindingTests", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            valueBinding: {
                type: "gpii.tests.chartAuthoring.valueBinding",
                container: ".gpiic-ca-valueBinding"
            },
            valueBindingTester: {
                type: "gpii.tests.chartAuthoring.valueBindingTester"
            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoring.valueBindingTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Tests value binding",
            tests: [{
                expect: 3,
                name: "Test Init",
                type: "test",
                func: "gpii.tests.chartAuthoring.valueBindingTester.verifyInit",
                args: ["{valueBinding}"]
            }, {
                expect: 4,
                name: "Update DOM from Model",
                sequence: [{
                    func: "{valueBinding}.applier.change",
                    args: ["val1", "label"]
                }, {
                    listener: "gpii.tests.chartAuthoring.valueBindingTester.verifyValueBinding",
                    args: ["{valueBinding}", {
                        val1: "label",
                        nested: {
                            val2: "bar"
                        }
                    }],
                    spec: {path: "val1", priority: "last"},
                    changeEvent: "{valueBinding}.applier.modelChanged"
                }, {
                    func: "{valueBinding}.applier.change",
                    args: ["nested.val2", "input"]
                }, {
                    listener: "gpii.tests.chartAuthoring.valueBindingTester.verifyValueBinding",
                    args: ["{valueBinding}", {
                        val1: "label",
                        nested: {
                            val2: "input"
                        }
                    }],
                    spec: {path: "nested.val2", priority: "last"},
                    changeEvent: "{valueBinding}.applier.modelChanged"
                }]
            }, {
                expect: 2,
                name: "Update Model from DOM",
                sequence: [{
                    func: "gpii.tests.utils.triggerChangeEvent",
                    args: ["{valueBinding}.dom.bidirectional", "updated input value"]
                }, {
                    listener: "gpii.tests.chartAuthoring.valueBindingTester.verifyValueBinding",
                    args: ["{valueBinding}", {
                        val1: "label",
                        nested: {
                            val2: "updated input value"
                        }
                    }],
                    spec: {path: "nested.val2", priority: "last"},
                    changeEvent: "{valueBinding}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.chartAuthoring.valueBindingTester.verifyInit = function (that) {
        jqUnit.assertValue("The component should have been initialized.", that);
        gpii.tests.chartAuthoring.valueBindingTester.verifyValueBinding(that, that.model);
    };

    gpii.tests.chartAuthoring.valueBindingTester.verifyValueBinding = function (that, expectedModel) {
        fluid.each(that.options.bindings, function (modelPath, selector) {
            var elm = that.locate(selector);
            var val = elm.is("input") ? elm.val() : elm.text();
            jqUnit.assertEquals("The value was set correctly", fluid.get(expectedModel, modelPath), val);
        });
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoring.valueBindingTests"
        ]);
    });

})(jQuery, fluid);
