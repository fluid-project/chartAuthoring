/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.tests.chartAuthoring", {
        gradeNames: ["gpii.chartAuthoring"],
        templateLoader: {
            terms: {
                templatePrefix: "../../src/html"
            }
        },
        components: {
            dataEntryPanel: {
                options: {
                    listeners: {
                        "onCreate.escalate": {
                            listener: "{chartAuthoring}.events.onPanelCreated.fire",
                            priority: "last"
                        }
                    }
                }
            }
        },
        events: {
            onPanelCreated: null
        }
    });

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
                expect: 6,
                sequence: [{
                    listener: "gpii.tests.chartAuthoringTester.verifyInit",
                    args: ["{chartAuthoring}"],
                    spec: {priority: "last"},
                    event: "{chartAuthoringTest chartAuthoring}.events.onTemplatesLoaded"
                }, {
                    // To work around the issue when two listeners are registered back to back, the second one doesn't get triggered.
                    func: "fluid.identity"
                }, {
                    listener: "gpii.tests.chartAuthoringTester.verifyPanel",
                    args: ["{gpii.tests.chartAuthoring}", "{gpii.tests.chartAuthoring}.dataEntryPanel"],
                    event: "{gpii.tests.chartAuthoring}.events.onPanelCreated"
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

    gpii.tests.chartAuthoringTester.verifyPanel = function (that, dataEntryPanel) {
        fluid.each(that.templateLoader.resources, function (resource, resourceName) {
            jqUnit.assertDeepEq("Templates have been passed into the dataEntryPanel sub-component", resource.resourceText,
                dataEntryPanel.options.resources[resourceName === "dataEntryPanel" ? "template": resourceName].resourceText);
        });
        jqUnit.assertNotEquals("The dataEntryPanel has been rendered", "", dataEntryPanel.container.html());
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoringTest"
        ]);
    });

})(jQuery, fluid);
