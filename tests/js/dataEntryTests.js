/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/floe/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("floe.tests.chartAuthoring.dataEntry", {
        gradeNames: ["floe.chartAuthoring.dataEntry"],
        model: {
            total: 100
        },
        resources: {
            template: {
                resourceText: "<input type=\"text\" class=\"floec-ca-dataEntry-label\">" +
                                "<input type=\"text\" class=\"floec-ca-dataEntry-value\">" +
                                "<span class=\"floec-ca-dataEntry-percentage\"></span>"

            }
        }
    });

    fluid.defaults("floe.tests.chartAuthoring.dataEntryTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            dataEntry: {
                type: "floe.tests.chartAuthoring.dataEntry",
                container: ".floec-ca-dataEntry"
            },
            dataEntryTester: {
                type: "floe.tests.chartAuthoring.dataEntryTester"
            }
        }
    });

    fluid.defaults("floe.tests.chartAuthoring.dataEntryTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        testOptions: {
            valueChange: 65,
            labelChange: "Value Label",
            domChange: 50
        },
        modules: [{
            name: "Tests the data entry component",
            tests: [{
                expect: 7,
                name: "Test Init",
                type: "test",
                func: "floe.tests.chartAuthoring.dataEntryTester.testRendering",
                args: ["{dataEntry}"]
            }, {
                expect: 3,
                name: "Change Model",
                sequence: [{
                    func: "{dataEntry}.applier.change",
                    args: ["value", "{that}.options.testOptions.valueChange"]
                }, {
                    listener: "floe.tests.chartAuthoring.dataEntryTester.verifyEntry",
                    args: ["{dataEntry}", {
                        value: "{that}.options.testOptions.valueChange",
                        percentage: "65.00%"
                    }],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{dataEntry}.applier.modelChanged"
                }, {
                    func: "{dataEntry}.applier.change",
                    args: ["label", "{that}.options.testOptions.labelChange"]
                }, {
                    listener: "floe.tests.chartAuthoring.dataEntryTester.verifyInput",
                    args: ["label", "{dataEntry}.dom.label", "{that}.options.testOptions.labelChange"],
                    spec: {path: "label", priority: "last"},
                    changeEvent: "{dataEntry}.applier.modelChanged"
                }]
            }, {
                expect: 1,
                name: "Change Input",
                sequence: [{
                    func: "floe.tests.utils.triggerChangeEvent",
                    args: ["{dataEntry}.dom.value", "{that}.options.testOptions.domChange"]
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["model.input should have been updated", "{that}.options.testOptions.domChange", "{dataEntry}.model.value"],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{dataEntry}.applier.modelChanged"
                }]
            }]
        }]
    });

    floe.tests.chartAuthoring.dataEntryTester.verifyInput = function (elmName, elm, expected) {
        jqUnit.assertEquals("The " + elmName + " value has been set", expected, elm.val());
    };

    floe.tests.chartAuthoring.dataEntryTester.verifyPercentage = function (elm, expected) {
        jqUnit.assertEquals("The percentage has been set", expected, elm.text());
    };

    floe.tests.chartAuthoring.dataEntryTester.verifyEntry = function (that, expected) {
        floe.tests.chartAuthoring.dataEntryTester.verifyInput("value", that.locate("value"), expected.value);
        floe.tests.chartAuthoring.dataEntryTester.verifyPercentage(that.locate("percentage"), expected.percentage);
    };

    floe.tests.chartAuthoring.dataEntryTester.verifyAccessibility = function(that) {
        var valueInput = that.locate("value");
        var labelInput = that.locate("label");
        jqUnit.assertEquals("An aria-label for the label input has been set", that.options.strings.labelInputAriaLabel, labelInput.attr("aria-label"));
        jqUnit.assertEquals("An aria-label for the value input has been set", that.options.strings.valueInputAriaLabel, valueInput.attr("aria-label"));
    };

    floe.tests.chartAuthoring.dataEntryTester.testRendering = function (that) {
        jqUnit.assertValue("The component should have been initialized.", that);
        var value = that.locate("value");
        var percentage = that.locate("percentage");
        var label = that.locate("label");

        floe.tests.chartAuthoring.dataEntryTester.verifyInput("value", value, that.model.value || "");
        jqUnit.assertEquals("The value input placeholder has been set", that.options.strings.valueInputPlaceholder, value.attr("placeholder"));

        floe.tests.chartAuthoring.dataEntryTester.verifyPercentage(percentage, "%");

        floe.tests.chartAuthoring.dataEntryTester.verifyInput("label", label, that.model.label || "");

        floe.tests.chartAuthoring.dataEntryTester.verifyAccessibility(that);

    };

    $(document).ready(function () {
        fluid.test.runTests([
            "floe.tests.chartAuthoring.dataEntryTest"
        ]);
    });

})(jQuery, fluid);
