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

    gpii.tests.calculatePercentage.isNumberInputs = [undefined, null, NaN, false, true, function () {}, {}, ["array"], "", "string", 2.2, "2.2", 0, "0", 50, "50"];
    gpii.tests.calculatePercentage.isNumberOutputs = [false, false, false, false, false, false, false, false, false, false, true, false, true, false, true, false];

    jqUnit.test("Test gpii.chartAuthoring.percentage.isNumber", function () {
        fluid.each(gpii.tests.calculatePercentage.isNumberInputs, function (value, idx) {
            var actual = gpii.chartAuthoring.percentage.isNumber(value);
            var expected = gpii.tests.calculatePercentage.isNumberOutputs[idx];
            jqUnit.assertEquals("value: '" + value + "', with typeof: " + typeof(value) + ", isNumber should be: " + expected, expected, actual);
        });
    });

    gpii.tests.calculatePercentage.inputs = [undefined, null, NaN, false, true, function () {}, {}, ["array"], "", "string", 2.2, "2.2", 0, "0", 50, 100];
    gpii.tests.calculatePercentage.outputs = [
        // value:
        // undefined, null, NaN, false, true, function, {}, [], "", "string", 2.2, "2.2", 0, "0", 50, 100]
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === undefined
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === null
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === NaN
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === false
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === true
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === function () {}
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === {}
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === []
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === ""
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === "string"
        [null, null, null, null, null, null, null, null, null, null, 100, null, 0, null, 2272.7272727272725, 4545.454545454545], // total === 2.2
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === "2.2"
        [null, null, null, null, null, null, null, null, null, null, 0, null, 0, null, 0, 0], // total === 0
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], // total === "0"
        [null, null, null, null, null, null, null, null, null, null, 4.4, null, 0, null, 100, 200], // total === 50
        [null, null, null, null, null, null, null, null, null, null, 2.2, null, 0, null, 50, 100] // total === 100
    ];

    jqUnit.test("Test gpii.chartAuthoring.percentage.calculate", function () {
        fluid.each(gpii.tests.calculatePercentage.inputs, function (total, totalIdx) {
            fluid.each(gpii.tests.calculatePercentage.inputs, function (value, valIdx) {
                var actual = gpii.chartAuthoring.percentage.calculate(value, total);
                var expected = gpii.tests.calculatePercentage.outputs[totalIdx][valIdx];
                // Using fluid.model.isSameValue to remove any javascript precision errors on floating point numbers.
                jqUnit.assertTrue("The percentate for value: " + value + " total: " + total + " should be calculated as " + expected, fluid.model.isSameValue(expected, actual));
            });
        });
    });

    fluid.registerNamespace("gpii.tests.renderPerencentage");

    gpii.tests.percentages = [null, 0, "0", "10.5", 10.5, "10", 10, "10.5", 10.5, "10", 10];

    gpii.tests.renderPerencentage.templates = [undefined, "%percentage%"];

    gpii.tests.renderPerencentage.digits = [undefined, 2];

    gpii.tests.renderPerencentage.outputs = [
        ["", "0", "0", "11", "11", "10", "10", "11", "11", "10", "10"], // template === undefined
        ["%", "0%", "0%", "11%", "11%", "10%", "10%", "11%", "11%", "10%", "10%"] // template === "%percentage%"
    ];

    fluid.each(gpii.tests.renderPerencentage.templates, function (template, templateIdx) {
        fluid.each(gpii.tests.percentages, function (percentage, perIdx) {
            jqUnit.test("Test gpii.chartAuthoring.percentage.render - percentage: " + percentage + ", template: " + template, function () {
                var elm = $(".renderPerencentage-test");
                var expected = gpii.tests.renderPerencentage.outputs[templateIdx][perIdx];
                gpii.chartAuthoring.percentage.render(elm, percentage, template);
                var actual = elm.text();
                jqUnit.assertEquals("The percentage should be rendered into the DOM correctly.", expected, actual);
            });
        });
    });

    gpii.tests.renderPerencentage.digitOutputs = [
        ["", "0", "0", "11", "11", "10", "10", "11", "11", "10", "10"], // digits === undefined
        ["", "0.00", "0.00", "10.50", "10.50", "10.00", "10.00", "10.50", "10.50", "10.00", "10.00"] // digits === "2"
    ];

    fluid.each(gpii.tests.renderPerencentage.digits, function (digits, digitIdx) {
        fluid.each(gpii.tests.percentages, function (percentage, perIdx) {
            jqUnit.test("Test gpii.chartAuthoring.percentage.render - percentage: " + percentage + ", digits: " + digits, function () {
                var elm = $(".renderPerencentage-test");
                var expected = gpii.tests.renderPerencentage.digitOutputs[digitIdx][perIdx];
                gpii.chartAuthoring.percentage.render(elm, percentage, undefined, digits);
                var actual = elm.text();
                jqUnit.assertEquals("The percentage should be rendered into the DOM correctly.", expected, actual);
            });
        });
    });

})(jQuery, fluid);
