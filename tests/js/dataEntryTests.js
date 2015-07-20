/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    jqUnit.test("Test gpii.chartAuthoring.dataEntry.calculatePercentage", function () {
        jqUnit.assertEquals("An undefined value should return \"\"", "", gpii.chartAuthoring.dataEntry.calculatePercentage(undefined, 10));
        jqUnit.assertEquals("An undefined total should return \"\"", "", gpii.chartAuthoring.dataEntry.calculatePercentage(10, undefined));
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntry", {
        gradeNames: ["gpii.chartAuthoring.dataEntry", "autoInit"],
        model: {
            total: 100
        },
        resources: {
            template: {
                resourceText: "<input type=\"text\" class=\"gpiic-ca-dataEntry-value\">" +
                                "<span class=\"gpiic-ca-dataEntry-percentage\"></span>" +
                                "<input type=\"text\" class=\"gpiic-ca-dataEntry-label\">"
            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntryTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            dataEntry: {
                type: "gpii.tests.chartAuthoring.dataEntry",
                container: ".gpiic-ca-dataEntry"
            },
            dataEntryTester: {
                type: "gpii.tests.chartAuthoring.dataEntryTester"
            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntryTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            valueChange: 65,
            descriptionChange: "Description of Input",
            domChange: 50
        },
        modules: [{
            name: "Tests the data entry component",
            tests: [{
                expect: 8,
                name: "Test Init",
                type: "test",
                func: "gpii.tests.chartAuthoring.dataEntryTester.testRendering",
                args: ["{dataEntry}"]
            }, {
                expect: 3,
                name: "Change Model",
                sequence: [{
                    func: "{dataEntry}.applier.change",
                    args: ["value", "{that}.options.testOptions.valueChange"]
                }, {
                    listener: "gpii.tests.chartAuthoring.dataEntryTester.verifyEntry",
                    args: ["{dataEntry}", {
                        value: "{that}.options.testOptions.valueChange",
                        percentage: "65%"
                    }],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{dataEntry}.applier.modelChanged"
                }, {
                    func: "{dataEntry}.applier.change",
                    args: ["description", "{that}.options.testOptions.descriptionChange"]
                }, {
                    listener: "gpii.tests.chartAuthoring.dataEntryTester.verifyInput",
                    args: ["description", "{dataEntry}.dom.description", "{that}.options.testOptions.descriptionChange"],
                    spec: {path: "description", priority: "last"},
                    changeEvent: "{dataEntry}.applier.modelChanged"
                }]
            }, {
                expect: 1,
                name: "Change Input",
                sequence: [{
                    func: "gpii.tests.utils.triggerChangeEvent",
                    args: ["{dataEntry}.dom.input", "{that}.options.testOptions.domChange"]
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["model.input should have been updated", "{that}.options.testOptions.domChange", "{dataEntry}.model.value"],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{dataEntry}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.chartAuthoring.dataEntryTester.verifyInput = function (elmName, elm, expected) {
        jqUnit.assertEquals("The " + elmName + " value has been set", expected, elm.val());
    };

    gpii.tests.chartAuthoring.dataEntryTester.verifyPercentage = function (elm, expected) {
        jqUnit.assertEquals("The percentage has been set", expected, elm.text());
    };

    gpii.tests.chartAuthoring.dataEntryTester.verifyEntry = function (that, expected) {
        gpii.tests.chartAuthoring.dataEntryTester.verifyInput("input", that.locate("input"), expected.value);
        gpii.tests.chartAuthoring.dataEntryTester.verifyPercentage(that.locate("percentage"), expected.percentage);
    };

    gpii.tests.chartAuthoring.dataEntryTester.testRendering = function (that) {
        jqUnit.assertValue("The component should have been initialized.", that);
        var input = that.locate("input");
        var percentage = that.locate("percentage");
        var description = that.locate("description");

        gpii.tests.chartAuthoring.dataEntryTester.verifyInput("input", input, that.model.value || "");
        jqUnit.assertEquals("The input placholder has been set", that.options.strings.inputPlaceholder, input.attr("placeholder"));

        gpii.tests.chartAuthoring.dataEntryTester.verifyPercentage(percentage, "%");

        gpii.tests.chartAuthoring.dataEntryTester.verifyInput("description", description, that.model.description || "");
        jqUnit.assertEquals("The description placholder has been set", that.options.strings.descriptionPlacholder, description.attr("placeholder"));
        jqUnit.assertEquals("The description's max length should be set", that.options.descriptionMaxLength, description.attr("maxlength"));
        var descriptionSize = parseInt(description.attr("size"), 10);
        jqUnit.assertTrue("The description's size should be set to a size that will accommodate the maximum description and the placeholder text.", descriptionSize >= that.options.descriptionMaxLength && descriptionSize >= that.options.strings.descriptionPlacholder.length);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoring.dataEntryTest"
        ]);
    });

})(jQuery, fluid);
