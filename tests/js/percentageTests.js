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
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === undefined
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === null
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === NaN
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === false
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === true
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === function () {}
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === {}
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === []
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === ""
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === "string"
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 0, 0, 2272.7272727272725, 2272.7272727272725, 4545.454545454545, 4545.454545454545], // total === 2.2
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 0, 0, 2272.7272727272725, 2272.7272727272725, 4545.454545454545, 4545.454545454545], // total === "2.2"
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === 0
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 220, 0, 0, 5000, 5000, 10000, 10000], // total === "0"
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4.4, 4.4, 0, 0, 100, 100, 200, 200], // total === 50
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4.4, 4.4, 0, 0, 100, 100, 200, 200], // total === "50"
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2.2, 2.2, 0, 0, 50, 50, 100, 100], // total === 100
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2.2, 2.2, 0, 0, 50, 50, 100, 100] // total === "100"
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

    fluid.registerNamespace("gpii.tests.retrieveVal");

    gpii.tests.retrieveVal.percentages = [
        "10.5",
        10.5,
        "10",
        10,
        function () {return "10.5";},
        function () {return 10.5;},
        function () {return "10";},
        function () {return 10;}
    ];

    gpii.tests.retrieveVal.percentages = ["10.5", 10.5, "10", 10, "10.5", 10.5, "10", 10];

    jqUnit.test("Test gpii.chartAuthoring.percentage.retrieveVal", function () {
        fluid.each(gpii.tests.retrieveVal.percentages, function (percentage, idx) {
            jqUnit.assertEquals("The value should have been retrieved correctly", gpii.tests.retrieveVal.percentages[idx], gpii.chartAuthoring.percentage.retrieveVal(percentage));
        });
    });

    fluid.registerNamespace("gpii.tests.renderPerencentage");

    gpii.tests.renderPerencentage.templates = [undefined, "%percentage%"];

    gpii.tests.renderPerencentage.outputs = [
        ["10.5", "10.5", "10", "10", "10.5", "10.5", "10", "10"], // template === undefined
        ["10.5%", "10.5%", "10%", "10%", "10.5%", "10.5%", "10%", "10%"] // template === "%percentage%"
    ];

    jqUnit.test("Test gpii.chartAuthoring.percentage.render", function () {
        var elm = $(".renderPerencentage-test");
        fluid.each(gpii.tests.renderPerencentage.templates, function (template, templateIdx) {
            fluid.each(gpii.tests.retrieveVal.percentages, function (percentage, perIdx) {
                // make sure the text is reset
                elm.text("");

                var expected = gpii.tests.renderPerencentage.outputs[templateIdx][perIdx];
                gpii.chartAuthoring.percentage.render(elm, percentage, template);
                var actual = elm.text();
                jqUnit.assertEquals("The percentage should be rendered into the DOM correctly.", expected, actual);

                // cleanup after test
                elm.text("");
            });
        });
    });

    fluid.registerNamespace("gpii.tests.percentagesIfValue");

    gpii.tests.percentagesIfValue.values = [undefined, null, NaN, "", false, true, 0, "0", 10];
    gpii.tests.percentagesIfValue.outputs = [
        ["", "", "", "", "", "", "", ""], // value === undefined
        ["", "", "", "", "", "", "", ""], // value === null
        ["10.5", "10.5", "10", "10", "10.5", "10.5", "10", "10"], // value === NaN
        ["10.5", "10.5", "10", "10", "10.5", "10.5", "10", "10"], // value === ""
        ["10.5", "10.5", "10", "10", "10.5", "10.5", "10", "10"], // value === false
        ["10.5", "10.5", "10", "10", "10.5", "10.5", "10", "10"], // value === true
        ["10.5", "10.5", "10", "10", "10.5", "10.5", "10", "10"], // value === 0
        ["10.5", "10.5", "10", "10", "10.5", "10.5", "10", "10"], // value === "0"
        ["10.5", "10.5", "10", "10", "10.5", "10.5", "10", "10"] // value === 10
    ];

    jqUnit.test("Test gpii.chartAuthoring.percentage.percentageIfValue", function () {
        fluid.each(gpii.tests.percentagesIfValue.values, function (value, valIdx) {
            fluid.each(gpii.tests.retrieveVal.percentages, function (percentage, perIdx) {
                var expected = gpii.tests.percentagesIfValue.outputs[valIdx][perIdx];
                var actual = gpii.chartAuthoring.percentage.percentageIfValue(percentage, value);
                jqUnit.assertEquals("The expected percentage is returned", expected, actual);
            });
        });

        var defaultPercentage = 100;
        var actualPercentage = gpii.chartAuthoring.percentage.percentageIfValue(10, null, defaultPercentage);
        jqUnit.assertEquals("The expected defaultPercentage is returned", defaultPercentage, actualPercentage);
    });

})(jQuery, fluid);
