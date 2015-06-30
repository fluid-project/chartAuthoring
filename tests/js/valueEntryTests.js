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

    jqUnit.test("Test gpii.chartAuthoring.valueEntry.calculatePercentage", function () {
        fluid.each(gpii.tests.calculatePercentage.inputs, function (total, totalIdx) {
            fluid.each(gpii.tests.calculatePercentage.inputs, function (value, valIdx) {
                var actual = gpii.chartAuthoring.valueEntry.calculatePercentage(value, total);
                var expected = gpii.tests.calculatePercentage.outputs[totalIdx][valIdx];
                jqUnit.assertEquals("The percentate for value: " + value + " total: " + total + " should be calculated as " + expected, expected, actual);
            });
        });
    });

    fluid.defaults("gpii.tests.chartAuthoring.valueEntry", {
        gradeNames: ["gpii.chartAuthoring.valueEntry", "autoInit"]
    });

    fluid.defaults("gpii.tests.chartAuthoring.valueEntryTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            valueEntry: {
                type: "gpii.tests.chartAuthoring.valueEntry",
                container: ".gpiic-ca-valueEntry"
            },
            valueEntryTester: {
                type: "gpii.tests.chartAuthoring.valueEntryTester"
            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoring.valueEntryTester", {
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
                func: "gpii.tests.chartAuthoring.valueEntryTester.testRendering",
                args: ["{valueEntry}"]
            }, {
                expect: 2,
                name: "Change Model",
                sequence: [{
                    func: "{valueEntry}.applier.change",
                    args: ["input", "{that}.options.testOptions.inputChange"]
                }, {
                    listener: "gpii.tests.chartAuthoring.valueEntryTester.verifyInput",
                    args: ["input", "{valueEntry}.dom.input", "{that}.options.testOptions.inputChange"],
                    spec: {path: "input", priority: "last"},
                    changeEvent: "{valueEntry}.applier.modelChanged"
                }, {
                    func: "{valueEntry}.applier.change",
                    args: ["description", "{that}.options.testOptions.descriptionChange"]
                }, {
                    listener: "gpii.tests.chartAuthoring.valueEntryTester.verifyInput",
                    args: ["description", "{valueEntry}.dom.description", "{that}.options.testOptions.descriptionChange"],
                    spec: {path: "description", priority: "last"},
                    changeEvent: "{valueEntry}.applier.modelChanged"
                }]
            }, {
                expect: 1,
                name: "Change Input",
                sequence: [{
                    func: "gpii.tests.utils.triggerChangeEvent",
                    args: ["{valueEntry}.dom.input", "{that}.options.testOptions.domChange"]
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["model.input shoudl have been updated", "{that}.options.testOptions.domChange", "{valueEntry}.model.input"],
                    spec: {path: "input", priority: "last"},
                    changeEvent: "{valueEntry}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.chartAuthoring.valueEntryTester.verifyInput = function (elmName, elm, expected) {
        jqUnit.assertEquals("The " + elmName + " value has been set", expected, elm.val());
    };

    gpii.tests.chartAuthoring.valueEntryTester.verifyPercentage = function (elm, expected) {
        jqUnit.assertEquals("The percentage has been set", expected, elm.text());
    };

    gpii.tests.chartAuthoring.valueEntryTester.testRendering = function (that) {
        jqUnit.assertValue("The component should have been initialized.", that);
        var input = that.locate("input");
        var percentage = that.locate("percentage");
        var description = that.locate("description");

        gpii.tests.chartAuthoring.valueEntryTester.verifyInput("input", input, that.model.value || "");
        jqUnit.assertEquals("The input placholder has been set", that.options.strings.inputPlaceholder, input.attr("placeholder"));

        gpii.tests.chartAuthoring.valueEntryTester.verifyPercentage(percentage, "%");

        gpii.tests.chartAuthoring.valueEntryTester.verifyInput("description", description, that.model.description || "");
        jqUnit.assertEquals("The description placholder has been set", that.options.strings.descriptionPlacholder, description.attr("placeholder"));
        jqUnit.assertEquals("The description's max length should be set", that.options.descriptionMaxLength, description.attr("maxlength"));
        var descriptionSize = parseInt(description.attr("size"), 10);
        jqUnit.assertTrue("The description's size should be set to a size that will accommodate the maximum description and the placeholder text.", descriptionSize >= that.options.descriptionMaxLength && descriptionSize >= that.options.strings.descriptionPlacholder.length);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoring.valueEntryTest"
        ]);
    });

})(jQuery, fluid);
