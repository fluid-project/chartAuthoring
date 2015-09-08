/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    jqUnit.test("Test the data conversion function", function () {
        jqUnit.expect(1);
        var convertedData = gpii.chartAuthoring.dataEntriesToPieChartData(gpii.tests.chartAuthoring.dataEntries);
        jqUnit.assertDeepEq("Data conversion between data entries and chart works", gpii.tests.chartAuthoring.dataSet, convertedData);
    });

    // IoC tests
    fluid.defaults("gpii.tests.chartAuthoring", {
        gradeNames: ["gpii.chartAuthoring"],
        templateLoader: {
            terms: {
                templatePrefix: "../../src/html"
            }
        },
        components: {
            pieChart: {
                container: ".gpiic-pieChart",
                options: {
                    listeners: {
                        "onPieChartRedrawn.escalate": {
                            listener: "{chartAuthoring}.events.onPieChartRedrawn.fire",
                            priority: "last"
                        }
                    }
                }
            }
        },
        events: {
            onPieChartRedrawn: null
        }
    });


    gpii.tests.chartAuthoring.dataEntries =
    {
        entry1: {
            value: "100",
            label: "Label One",
            percentage: "100%"
        },
        entry2: {
            value: "50",
            label: "Label Two",
            percentage: "100%"
        }
    };

    gpii.tests.chartAuthoring.dataSet =
    [
        {
            id: "entry1",
            value: "100",
            label: "Label One"
        },
        {
            id: "entry2",
            value: "50",
            label: "Label Two"
        }
    ];

    fluid.defaults("gpii.tests.chartAuthoringTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            chartAuthoring: {
                type: "gpii.tests.chartAuthoring",
                container: ".gpiic-chartAuthoring",
                createOnEvent: "{chartAuthoringTester}.events.onTestCaseStart"
            },
            chartAuthoringTester: {
                type: "gpii.tests.chartAuthoringTester"
            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoringTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Tests the data entry panel component",
            tests: [{
                name: "Chart Authoring Init",
                expect: 7,
                sequence: [{
                    listener: "gpii.tests.chartAuthoringTester.verifyInit",
                    args: ["{chartAuthoring}"],
                    spec: {priority: "last"},
                    event: "{chartAuthoringTest chartAuthoring}.events.onTemplatesLoaded"
                }, {
                    // To work around the issue when two listeners are registered back to back, the second one doesn't get triggered.
                    func: "fluid.identity"
                }, {
                    listener: "gpii.tests.chartAuthoringTester.verifyTool",
                    args: ["{gpii.tests.chartAuthoring}", "{gpii.tests.chartAuthoring}.dataEntryPanel"],
                    event: "{gpii.tests.chartAuthoring}.events.onToolReady"
                }, {
                    func: "{gpii.tests.chartAuthoring}.dataEntryPanel.applier.change",
                    args: ["dataEntries", gpii.tests.chartAuthoring.dataEntries]
                }, {
                    listener: "gpii.tests.chartAuthoringTester.verifyRelay",
                    args: ["{gpii.tests.chartAuthoring}"],
                    event: "{gpii.tests.chartAuthoring}.events.onPieChartRedrawn"
                }]
            }]
        }]
    });

    gpii.tests.chartAuthoringTester.verifyInit = function (that) {
        fluid.each(that.templateLoader.resources, function (resource, resourceName) {
            jqUnit.assertValue("The resource text for " + resourceName + " should have been fetched", resource.resourceText);
        });
        jqUnit.assertEquals("The dataEntryPanel has not been rendered", "", that.container.html());
    };

    gpii.tests.chartAuthoringTester.verifyTool = function (that) {
        // TODO: rewrite this test to handle the new template situation
        // fluid.each(that.templateLoader.resources, function (resource, resourceName) {
        //    jqUnit.assertDeepEq("Templates have been passed into the dataEntryPanel sub-component", resource.resourceText,
        //    dataEntryPanel.options.resources[resourceName === "dataEntryPanel" ? "template": resourceName].resourceText);
        // });
        jqUnit.assertNotEquals("The dataEntryPanel has been rendered", "", that.dataEntryPanel.container.html());
        jqUnit.assertNotEquals("The pieChart has been rendered", "", that.pieChart.container.html());
    };

    gpii.tests.chartAuthoringTester.verifyRelay = function (that) {
        // 1) Test that the models are kept in sync by the relay
        jqUnit.assertDeepEq("Model is relayed between dataEntryPanel and pieChart", gpii.tests.chartAuthoring.dataSet, that.pieChart.model.dataSet);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoringTest"
        ]);
    });

})(jQuery, fluid);
