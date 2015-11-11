/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    jqUnit.test("Test floe.chartAuthoring.dataEntryPanel.append", function () {
        var container = $(".appendtest");
        var template = "<span class='appendtest-appended'>Appended</span>";

        floe.chartAuthoring.dataEntryPanel.append(container, template);
        floe.chartAuthoring.dataEntryPanel.append(container, $(template));

        jqUnit.assertEquals("The elements should be appended to the container", 2, container.find(".appendtest-appended").length);
    });

    fluid.defaults("floe.tests.chartAuthoring.dataEntryPanel", {
        gradeNames: ["floe.chartAuthoring.dataEntryPanel"],
        resources: {
            template: {
                resourceText: "<form>" +
                                "<fieldset>" +
                                "<legend class=\"floec-ca-dataEntryPanel-dataEntryLabel\">Entry</legend>" +
                                "<ul class=\"floec-ca-dataEntryPanel-dataEntries\">" +
                                "<li class=\"floec-ca-dataEntryPanel-dataEntry\"></li>" +
                                "</ul>" +
                                "<span class=\"floec-ca-dataEntryPanel-totalLabel\">Total</span>" +
                                "<span class=\"floec-ca-dataEntryPanel-totalValue\">Value</span>" +
                                "<span class=\"floec-ca-dataEntryPanel-totalPercentage\">%</span>" +
                                "</fieldset>" +
                                "<button class=\"floec-ca-dataEntryPanel-resetButton floe-ca-dataEntryPanel-resetButton\" type=\"reset\">Reset</button>" +
                                "</form>"
            },
            dataEntry: {
                resourceText: "<input type=\"text\" class=\"floec-ca-dataEntry-label\">" +
                                "<input type=\"text\" class=\"floec-ca-dataEntry-value\">" +
                                "<span class=\"floec-ca-dataEntry-percentage\"></span>"

            }
        }
    });

    fluid.defaults("floe.tests.chartAuthoring.dataEntryPanelTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            dataEntryPanel: {
                type: "floe.tests.chartAuthoring.dataEntryPanel",
                container: ".floec-ca-dataEntryPanel"
            },
            dataEntryPanelTester: {
                type: "floe.tests.chartAuthoring.dataEntryPanelTester"
            }
        }
    });

    fluid.defaults("floe.tests.chartAuthoring.dataEntryPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        testOptions: {
            totalsChanged: {
                value: 10
            },
            entryValue1: 20,
            entryValue2: 30,
            totalsExpected: {
                value: 10,
                percentage: "100%",
                label: "{dataEntryPanel}.options.strings.totalLabel"
            },
            totalsExpected1: {
                value: 20,
                percentage: "100%",
                label: "{dataEntryPanel}.options.strings.totalLabel"
            },
            totalsExpected2: {
                value: 50,
                percentage: "100%",
                label: "{dataEntryPanel}.options.strings.totalLabel"
            }
        },
        modules: [{
            name: "Tests the data entry panel component",
            tests: [{
                expect: 1,
                name: "Test Init",
                type: "test",
                func: "jqUnit.assertValue",
                args: ["The component should have been initialized.", "{dataEntryPanel}"]
            }, {
                expect: 14,
                name: "Test Initial Rendering",
                type: "test",
                func: "floe.tests.chartAuthoring.dataEntryPanelTester.testRendering",
                args: ["{dataEntryPanel}"]
            }, {
                name: "Model Changed Sequence",
                expect: 16,
                sequence: [{
                    func: "{dataEntryPanel}.dataEntry.applier.change",
                    args: ["value", "{that}.options.testOptions.entryValue1"]
                }, {
                    listener: "floe.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput",
                    args: ["{dataEntryPanel}", "{that}.options.testOptions.totalsExpected1"],
                    spec: {path: "total", priority: "last"},
                    changeEvent: "{dataEntryPanel}.applier.modelChanged"
                }, {
                    func: "{dataEntryPanel}.dataEntry-1.applier.change",
                    args: ["value", "{that}.options.testOptions.entryValue2"]
                }, {
                    listener: "floe.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput",
                    args: ["{dataEntryPanel}", "{that}.options.testOptions.totalsExpected2"],
                    spec: {path: "total", priority: "last"},
                    changeEvent: "{dataEntryPanel}.applier.modelChanged"
                }]
            }]
        }]
    });

    floe.tests.chartAuthoring.dataEntryPanelTester.testRendering = function (that) {
        var dataEntryLabel = that.locate("dataEntryLabel");
        jqUnit.assertEquals("The data entry label should be set", that.options.strings.dataEntryLabel, dataEntryLabel.text());

        // Test creation of dataEntry components
        var expectedDataEntryFields = that.options.numDataEntryFields;
        jqUnit.assertEquals("There should be " + expectedDataEntryFields + " data entry components added", expectedDataEntryFields, that.locate("dataEntry").length);
        jqUnit.assertEquals("There should be " + expectedDataEntryFields + " data entries added to the model", expectedDataEntryFields, fluid.keys(that.model.dataEntries).length);

        var resetButton = that.locate("resetButton");
        jqUnit.assertEquals("The reset button is rendered", 1, resetButton.length);
        // TODO: need test for reset binding and behaviour to the button

        floe.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput(that, {
            label: that.options.strings.totalLabel,
            value: that.options.strings.emptyTotalValue,
            percentage: "%"
        });

        // Test application of aria-labelledby to displayed total
        var totalLabelId = that.locate("totalLabel").attr("id");
        var totalValue = that.locate("totalValue");
        jqUnit.assertEquals("Total label is connected to displayed total by aria-labelledby", totalLabelId, totalValue.attr("aria-labelledby"));

        // Test application of aria-live to displayed total

        jqUnit.assertEquals("Total value is set to aria-live appropriately", "polite", totalValue.attr("aria-live"));

    };

    floe.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput = function (that, expected) {
        jqUnit.assertEquals("The total label should be set", expected.label, that.locate("totalLabel").text());
        // Coerce expected.value to string for comparison with rendered value in HTML
        jqUnit.assertEquals("The total value should be set", String(expected.value), that.locate("totalValue").text());
        jqUnit.assertEquals("The total percentage should be set", expected.percentage, that.locate("totalPercentage").text());

        for (var i = 0; i < that.options.numDataEntryFields; i++) {
            var dataEntry = "dataEntry" + (i ? "-" + i : "");
            jqUnit.assertEquals("The total for " + dataEntry + " should be updated from the panel total", that.model.total.value, that[dataEntry].model.total);
        }
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "floe.tests.chartAuthoring.dataEntryPanelTest"
        ]);
    });

})(jQuery, fluid);
