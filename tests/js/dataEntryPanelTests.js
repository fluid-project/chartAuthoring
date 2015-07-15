/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.tests.chartAuthoring.dataEntries");

    gpii.tests.chartAuthoring.dataEntries.ints = {
        "ints1": {value: 0},
        "ints2": {value: 1},
        "ints3": {value: "1"}
    };

    gpii.tests.chartAuthoring.dataEntries.floats = {
        "floats1": {value: 2.2},
        "floats2": {value: "2.2"}
    };

    gpii.tests.chartAuthoring.dataEntries.invalid = {
        "invalid1": {value: null},
        "invalid2": {value: ""},
        "invalid3": {}
    };

    gpii.tests.chartAuthoring.dataEntries.mixed = $.extend(true, {}, gpii.tests.chartAuthoring.dataEntries.ints, gpii.tests.chartAuthoring.dataEntries.floats, gpii.tests.chartAuthoring.dataEntries.invalid);

    gpii.tests.chartAuthoring.expectedSums = {
        ints: 2,
        floats: 4.4,
        invalid: undefined,
        mixed: 6.4
    };

    jqUnit.test("Test gpii.chartAuthoring.dataEntryPanel.sumDataEntries", function () {
        fluid.each(gpii.tests.chartAuthoring.dataEntries, function (entries, type) {
            var sum = gpii.chartAuthoring.dataEntryPanel.sumDataEntries(entries);
            jqUnit.assertEquals("The '" + type + "' data entries should have been summed correctly", gpii.tests.chartAuthoring.expectedSums[type], sum);
        });
    });

    jqUnit.test("Test gpii.chartAuthoring.dataEntryPanel.append", function () {
        var container = $(".appendtest");
        var template = "<span class='appendtest-appended'>Appended</span>";

        gpii.chartAuthoring.dataEntryPanel.append(container, template);
        gpii.chartAuthoring.dataEntryPanel.append(container, $(template));

        jqUnit.assertEquals("The elments should be appendend to the container", 2, container.find(".appendtest-appended").length);
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntryPanel", {
        gradeNames: ["gpii.chartAuthoring.dataEntryPanel", "autoInit"],
        dynamicComponents: {
            dataEntry: {
                options: {
                    resources: {
                        template: {
                            resourceText: "<input type=\"text\" class=\"gpiic-ca-dataEntry-input\">" +
                                            "<span class=\"gpiic-ca-dataEntry-percentage\"></span>" +
                                            "<input type=\"text\" class=\"gpiic-ca-dataEntry-description\">"
                        }
                    }
                }
            }
        },
        resources: {
            template: {
                resourceText: "<h2 class=\"gpiic-ca-dataEntryPanel-title\">Panel Title</h2>" +
                                "<p class=\"gpiic-ca-dataEntryPanel-description\">Description</p>" +
                                "<form>" +
                                "<label class=\"gpiic-ca-dataEntryPanel-nameLabel\", for=\"gpiic-ca-dataEntryPanel-name\">Chart name label</label><span>:</span>" +
                                "<input id=\"gpiic-ca-dataEntryPanel-name\" class=\"gpiic-ca-dataEntryPanel-name\" type=\"text\" placeholder=\"\">" +
                                "<fieldset>" +
                                "<legend class=\"gpiic-ca-dataEntryPanel-dataEntryLabel\">Entry</legend>" +
                                "<ul class=\"gpiic-ca-dataEntryPanel-dataEntries\">" +
                                "<li class=\"gpiic-ca-dataEntryPanel-dataEntry\"></li>" +
                                "</ul>" +
                                "<span class=\"gpiic-ca-dataEntryPanel-totalValue\">Value</span>" +
                                "<span class=\"gpiic-ca-dataEntryPanel-totalPercentage\">%</span>" +
                                "<span class=\"gpiic-ca-dataEntryPanel-totalLabel\">Total</span>" +
                                "</fieldset>" +
                                "</form>"
            }
        }
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
                expect: 17,
                name: "Test Initial Rendering",
                type: "test",
                func: "gpii.tests.chartAuthoring.dataEntryPanelTester.testRendering",
                args: ["{dataEntryPanel}"]
            }, {
                name: "Model Changed Sequence",
                expect: 16,
                sequence: [{
                    func: "{dataEntryPanel}.dataEntry.applier.change",
                    args: ["value", "{that}.options.testOptions.entryValue1"]
                }, {
                    listener: "gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput",
                    args: ["{dataEntryPanel}", "{that}.options.testOptions.totalsExpected1"],
                    spec: {path: "total", priority: "last"},
                    changeEvent: "{dataEntryPanel}.applier.modelChanged"
                }, {
                    func: "{dataEntryPanel}.dataEntry-1.applier.change",
                    args: ["value", "{that}.options.testOptions.entryValue2"]
                }, {
                    listener: "gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput",
                    args: ["{dataEntryPanel}", "{that}.options.testOptions.totalsExpected2"],
                    spec: {path: "total", priority: "last"},
                    changeEvent: "{dataEntryPanel}.applier.modelChanged"
                }]
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

        // Test creation of dataEntry components
        var expectedDataEntryFields = that.options.numDataEntryFields
        jqUnit.assertEquals("There should be " + expectedDataEntryFields + " data entry components added", expectedDataEntryFields, that.locate("dataEntry").length);
        jqUnit.assertEquals("There should be " + expectedDataEntryFields + " data entries added to the model", expectedDataEntryFields, fluid.keys(that.model.dataEntries).length);

        gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput(that, {
            label: that.options.strings.totalLabel,
            value: that.options.strings.emptyTotalValue,
            percentage: "%"
        });
    };

    gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput = function (that, expected) {
        jqUnit.assertEquals("The total label should be set", expected.label, that.locate("totalLabel").text());
        jqUnit.assertEquals("The total value should be set", expected.value, that.locate("totalValue").text());
        jqUnit.assertEquals("The total percentage should be set", expected.percentage, that.locate("totalPercentage").text());

        for (var i = 0; i < that.options.numDataEntryFields; i++) {
            var dataEntry = "dataEntry" + (i ? "-" + i : "");
            jqUnit.assertEquals("The total for " + dataEntry + " should be updated from the panel total", that.model.total.value, that[dataEntry].model.total);
        }
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoring.dataEntryPanelTest"
        ]);
    });

})(jQuery, fluid);
