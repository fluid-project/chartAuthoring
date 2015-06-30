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
        modules: [{
            name: "Tests the value entry component",
            tests: [{
                expect: 11,
                name: "Test Init",
                type: "test",
                func: "gpii.tests.chartAuthoring.valueEntryTester.testRendering",
                args: ["{valueEntry}"]
            }]
        }]
    });

    gpii.tests.chartAuthoring.valueEntryTester.testRendering = function (that) {
        jqUnit.assertValue("The component should have been initialized.", that);
        fluid.each(that.options.selectors, function (sel, selName) {
            jqUnit.exists("The '" + selName + "' element exists.", that.locate(selName));
        });
        jqUnit.assertEquals("The input value has been set", that.model.value || "", that.locate("input").val());
        jqUnit.assertEquals("The input placholder has been set", that.options.strings.inputPlaceholder, that.locate("input").attr("placeholder"));

        jqUnit.assertEquals("The percentage has been set", "%", that.locate("percentage").text());

        jqUnit.assertEquals("the description text has been set", that.model.description || "", that.locate("description").val());
        jqUnit.assertEquals("The description placholder has been set", that.options.strings.descriptionPlacholder, that.locate("description").attr("placeholder"));
        jqUnit.assertEquals("The description's max length should be set", that.options.descriptionMaxLength, that.locate("description").attr("maxlength"));
        var descriptionSize = parseInt(that.locate("description").attr("size"), 10);
        jqUnit.assertTrue("The description's size should be set to a size that will accomodate the maximum description and the placholder text.", descriptionSize >= that.options.descriptionMaxLength && descriptionSize >= that.options.strings.descriptionPlacholder.length);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoring.valueEntryTest"
        ]);
    });

})(jQuery, fluid);
