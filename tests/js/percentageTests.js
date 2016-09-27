/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* global fluid, floe, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.tests.calculatePercentage");

    floe.tests.calculatePercentage.isNumberInputs = [undefined, null, NaN, false, true, function () {}, {}, ["array"], "", "string", 2.2, "2.2", 0, "0", 50, "50"];
    floe.tests.calculatePercentage.isNumberOutputs = [false, false, false, false, false, false, false, false, false, false, true, false, true, false, true, false];

    jqUnit.test("Test floe.chartAuthoring.percentage.isNumber", function () {
        fluid.each(floe.tests.calculatePercentage.isNumberInputs, function (value, idx) {
            var actual = floe.chartAuthoring.percentage.isNumber(value);
            var expected = floe.tests.calculatePercentage.isNumberOutputs[idx];
            jqUnit.assertEquals("value: '" + value + "', with typeof: " + typeof(value) + ", isNumber should be: " + expected, expected, actual);
        });
    });

    floe.tests.calculatePercentage.validInputs = [0, 2.2, 50, 100];
    floe.tests.calculatePercentage.invalidInputs = [undefined, null, NaN, false, true, function () {}, {}, ["array"], "", "string", "0", "2.2"];

    floe.tests.calculatePercentage.validOutputs = [
        // value:
        // 0, 2.2, 50, 100
        [0, 0, 0, 0], // total === 0
        [0, 100, 2272.7272727272725, 4545.454545454545], // total === 2.2
        [0, 4.4, 100, 200], // total === 50
        [0, 2.2, 50, 100] // total === 50
    ];

    jqUnit.test("Test floe.chartAuthoring.percentage.calculate - valid", function () {
        floe.tests.utils.matrixTest(floe.tests.calculatePercentage.validInputs, function (total, value, totalIdx, valIdx) {
            var actual = floe.chartAuthoring.percentage.calculate(value, total);
            var expected = floe.tests.calculatePercentage.validOutputs[totalIdx][valIdx];
            // Using fluid.model.isSameValue to remove any javascript precision errors on floating point numbers.
            jqUnit.assertTrue("The percentate for value: " + value + " total: " + total + " should be calculated as " + expected, fluid.model.isSameValue(expected, actual));
        });
    });

    jqUnit.test("Test floe.chartAuthoring.percentage.calculate - invalid", function () {
        floe.tests.utils.matrixTest(floe.tests.calculatePercentage.invalidInputs, function (total, value) {
            var actual = floe.chartAuthoring.percentage.calculate(value, total);
            jqUnit.assertNull("The percentate for value: " + value + " total: " + total + " should be calculated as null", actual);
        });
    });

    fluid.registerNamespace("floe.tests.renderPerencentage");

    floe.tests.percentages = [null, 0, "0", "10.5", 10.5, "10", 10, "10.5", 10.5, "10", 10];

    floe.tests.renderPerencentage.templates = [undefined, "%percentage%"];

    floe.tests.renderPerencentage.digits = [undefined, 2];

    floe.tests.renderPerencentage.outputs = [
        ["", "0", "0", "11", "11", "10", "10", "11", "11", "10", "10"], // template === undefined
        ["%", "0%", "0%", "11%", "11%", "10%", "10%", "11%", "11%", "10%", "10%"] // template === "%percentage%"
    ];

    fluid.each(floe.tests.renderPerencentage.templates, function (template, templateIdx) {
        fluid.each(floe.tests.percentages, function (percentage, perIdx) {
            jqUnit.test("Test floe.chartAuthoring.percentage.render - percentage: " + percentage + ", template: " + template, function () {
                var elm = $(".renderPerencentage-test");
                var expected = floe.tests.renderPerencentage.outputs[templateIdx][perIdx];
                floe.chartAuthoring.percentage.render(elm, percentage, template);
                var actual = elm.text();
                jqUnit.assertEquals("The percentage should be rendered into the DOM correctly.", expected, actual);
            });
        });
    });

    floe.tests.renderPerencentage.digitOutputs = [
        ["", "0", "0", "11", "11", "10", "10", "11", "11", "10", "10"], // digits === undefined
        ["", "0.00", "0.00", "10.50", "10.50", "10.00", "10.00", "10.50", "10.50", "10.00", "10.00"] // digits === "2"
    ];

    fluid.each(floe.tests.renderPerencentage.digits, function (digits, digitIdx) {
        fluid.each(floe.tests.percentages, function (percentage, perIdx) {
            jqUnit.test("Test floe.chartAuthoring.percentage.render - percentage: " + percentage + ", digits: " + digits, function () {
                var elm = $(".renderPerencentage-test");
                var expected = floe.tests.renderPerencentage.digitOutputs[digitIdx][perIdx];
                floe.chartAuthoring.percentage.render(elm, percentage, undefined, digits);
                var actual = elm.text();
                jqUnit.assertEquals("The percentage should be rendered into the DOM correctly.", expected, actual);
            });
        });
    });

})(jQuery, fluid);
