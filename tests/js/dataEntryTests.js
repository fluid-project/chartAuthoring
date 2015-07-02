/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.tests.calculatePercentage");

    gpii.tests.calculatePercentage.inputs = [undefined, null, NaN, false, true, function () {}, {}, ["array"], "", "string", 2.2, "2.2", 0, "0", 50, "50", 100, "100"];
    gpii.tests.calculatePercentage.outputs = [
        // undefined, null, NaN, false, true, function, {}, [], "", "string", 2.2, "2.2", 0, "0", 50, "50", 100, "100"]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === undefined
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === null
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === NaN
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === false
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === true
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === function () {}
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === {}
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === []
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === ""
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === "string"
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 0, 0, 2500, 2500, 5000, 5000], // total === 2.2
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 0, 0, 2500, 2500, 5000, 5000], // total === "2.2"
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === 0
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 200, 0, 0, 5000, 5000, 10000, 10000], // total === "0"
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 100, 100, 200, 200], // total === 50
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 100, 100, 200, 200], // total === "50"
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 50, 50, 100, 100], // total === 100
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 50, 50, 100, 100] // total === "100"
    ];

    jqUnit.test("Test gpii.chartAuthoring.dataEntry.calculatePercentage", function () {
        fluid.each(gpii.tests.calculatePercentage.inputs, function (total, totalIdx) {
            fluid.each(gpii.tests.calculatePercentage.inputs, function (value, valIdx) {
                var actual = gpii.chartAuthoring.dataEntry.calculatePercentage(value, total);
                var expected = gpii.tests.calculatePercentage.outputs[totalIdx][valIdx];
                jqUnit.assertEquals("The percentate for value: " + value + " total: " + total + " should be calculated as " + expected, expected, actual);
            });
        });
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntry", {
        gradeNames: ["gpii.chartAuthoring.dataEntry", "autoInit"]
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
            inputChange: "Input Name",
            descriptionChange: "Description of Input",
            domChange: "New Name"
        },
        modules: [{
            name: "Tests the value entry component",
            tests: [{
                expect: 8,
                name: "Test Init",
                type: "test",
                func: "gpii.tests.chartAuthoring.dataEntryTester.testRendering",
                args: ["{dataEntry}"]
            }, {
                expect: 2,
                name: "Change Model",
                sequence: [{
                    func: "{dataEntry}.applier.change",
                    args: ["input", "{that}.options.testOptions.inputChange"]
                }, {
                    listener: "gpii.tests.chartAuthoring.dataEntryTester.verifyInput",
                    args: ["input", "{dataEntry}.dom.input", "{that}.options.testOptions.inputChange"],
                    spec: {path: "input", priority: "last"},
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
                    args: ["model.input shoudl have been updated", "{that}.options.testOptions.domChange", "{dataEntry}.model.input"],
                    spec: {path: "input", priority: "last"},
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
