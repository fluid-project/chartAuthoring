/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/floe/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("floe.tests.chartAuthoring", {
        gradeNames: ["floe.chartAuthoring"],
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

    fluid.defaults("floe.tests.chartAuthoringTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            chartAuthoring: {
                type: "floe.tests.chartAuthoring",
                container: ".floec-chartAuthoring",
                createOnEvent: "{chartAuthoringTester}.events.onTestCaseStart"
            },
            chartAuthoringTester: {
                type: "floe.tests.chartAuthoringTester"
            }
        }
    });

    fluid.defaults("floe.tests.chartAuthoringTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Tests the data entry panel component",
            tests: [{
                name: "Chart Authoring Init",
                expect: 6,
                sequence: [{
                    listener: "floe.tests.chartAuthoringTester.verifyInit",
                    args: ["{chartAuthoring}"],
                    spec: {priority: "last"},
                    event: "{chartAuthoringTest chartAuthoring}.events.onTemplatesLoaded"
                }, {
                    // To work around the issue when two listeners are registered back to back, the second one doesn't get triggered.
                    func: "fluid.identity"
                }, {
                    listener: "floe.tests.chartAuthoringTester.verifyPanel",
                    args: ["{floe.tests.chartAuthoring}", "{floe.tests.chartAuthoring}.dataEntryPanel"],
                    event: "{floe.tests.chartAuthoring}.events.onPanelCreated"
                }]
            }]
        }]
    });

    floe.tests.chartAuthoringTester.verifyInit = function (that) {
        fluid.each(that.templateLoader.resources, function (resource, resourceName) {
            jqUnit.assertValue("The resource text for " + resourceName + " should have been fetched", resource.resourceText);
        });
        jqUnit.assertEquals("The dataEntryPanel has not been rendered", "", that.container.html());
    };

    floe.tests.chartAuthoringTester.verifyPanel = function (that, dataEntryPanel) {
        fluid.each(that.templateLoader.resources, function (resource, resourceName) {
            jqUnit.assertDeepEq("Templates have been passed into the dataEntryPanel sub-component", resource.resourceText,
                dataEntryPanel.options.resources[resourceName === "dataEntryPanel" ? "template": resourceName].resourceText);
        });
        jqUnit.assertNotEquals("The dataEntryPanel has been rendered", "", dataEntryPanel.container.html());
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "floe.tests.chartAuthoringTest"
        ]);
    });

})(jQuery, fluid);
