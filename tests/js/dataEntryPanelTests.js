/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.tests.chartAuthoring.dataEntryPanel", {
        gradeNames: ["gpii.chartAuthoring.dataEntryPanel", "autoInit"]
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntryPanelTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            dataEntryPanel: {
                type: "gpii.tests.chartAuthoring.dataEntryPanel",
                container: ".gpiic-ca-dataEntryPanel"
            },
            dataEntryPanelTester: {
                type: "gpii.tests.chartAuthoring.dataEntryPanelTester"
            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntryPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Tests the value entry component",
            tests: [{
                expect: 1,
                name: "Test Init",
                type: "test",
                func: "jqUnit.assertValue",
                args: ["The component should have been initialized.", "{dataEntryPanel}"]
            }, {
                expect: 10,
                name: "Test Initial Rendering",
                type: "test",
                func: "gpii.tests.chartAuthoring.dataEntryPanelTester.testRendering",
                args: ["{dataEntryPanel}"]
            }]
        }]
    });

    gpii.tests.chartAuthoring.dataEntryPanelTester.testRendering = function (that) {
        var panelTitle = that.locate("panelTitle");
        jqUnit.assertEquals("The panel title should be set", that.options.strings.panelTitle, panelTitle.text());

        var description = that.locate("description");
        jqUnit.assertEquals("The description should be set", that.options.strings.description, description.html());

        var chartNameLabel = that.locate("chartNameLabel");
        jqUnit.assertEquals("The chart name label should be set", that.options.strings.chartNameLabel, chartNameLabel.text());

        var chartName = that.locate("chartName");
        jqUnit.assertEquals("The chart name placholder has been set", that.options.strings.chartNamePlacholder, chartName.attr("placeholder"));
        jqUnit.assertEquals("The chart name's max length should be set", that.options.chartNameMaxLength, chartName.attr("maxlength"));
        var chartNameSize = parseInt(chartName.attr("size"), 10);
        jqUnit.assertTrue("The chartName's size should be set to a size that will accommodate the maximum name and the placeholder text.", chartNameSize >= that.options.chartNameMaxLength && chartNameSize >= that.options.strings.chartNamePlacholder.length);

        var dataEntryLabel = that.locate("dataEntryLabel");
        jqUnit.assertEquals("The data entry label should be set", that.options.strings.dataEntryLabel, dataEntryLabel.text());

        //TODO: Test creation of dataEntry components

        gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput(that, {
            label: that.options.strings.totalLabel,
            value: that.options.strings.emptyTotalValue,
            percentage: "%"
        });
    };

    gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput = function (that, expected) {
        jqUnit.assertEquals("The total label should be set", expected.label, that.locate("totalLabel").text());
        jqUnit.assertEquals("The total value should be set", expected.value, that.locate("totalValue").text());
        jqUnit.assertEquals("The total perenctage should be set", expected.percentage, that.locate("totalPercentage").text());
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoring.dataEntryPanelTest"
        ]);
    });

})(jQuery, fluid);
