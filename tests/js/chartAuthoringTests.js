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
        gradeNames: ["gpii.chartAuthoring", "autoInit"],
        templateLoader: {
            terms: {
                templatePrefix: "../../src/html"
            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoringTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
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
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Tests the data entry panel component",
            tests: [{
                name: "Chart Authoring Init",
                expect: 2,
                // TODO: Add test(s) to ensure the dataEntryPanel was initialized correctly.
                sequence: [{
                    listener: "gpii.tests.chartAuthoringTester.verifyInit",
                    args: ["{chartAuthoring}.templateLoader.resources"],
                    spec: {priority: "last"},
                    event: "{chartAuthoringTest chartAuthoring}.events.onTemplatesLoaded"
                }]
            }]
        }]
    });

    gpii.tests.chartAuthoringTester.verifyInit = function (resources) {
        fluid.each(resources, function (resource, resourceName) {
            jqUnit.assertValue("The resource text for " + resourceName + " should have been fetched", resource.resourceText);
        });
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoringTest"
        ]);
    });

})(jQuery, fluid);
