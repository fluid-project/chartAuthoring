/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.chartAuthoring", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        components: {
            templateLoader: {
                type: "fluid.prefs.resourceLoader",
                options: {
                    events: {
                        onResourcesLoaded: "{chartAuthoring}.events.onTemplatesLoaded"
                    }
                }
            },
            dataEntryPanel: {
                type: "gpii.chartAuthoring.dataEntryPanel",
                createOnEvent: "onTemplatesLoaded",
                container: "{chartAuthoring}.container",
                options: {
                    resources: {
                        template: "{templateLoader}.resources.dataEntryPanel",
                        dataEntry: "{templateLoader}.resources.dataEntry"
                    }
                }
            }
        },
        events: {
            onTemplatesLoaded: null
        },
        // The terms and/or resources need to be set to the appropriate locations
        // by the integrator.
        templateLoader: {
            terms: {
                templatePrefix: ""
            },
            resources: {
                dataEntryPanel: "%templatePrefix/dataEntryPanelTemplate.html",
                dataEntry: "%templatePrefix/dataEntryTemplate.html"
            }
        },
        distributeOptions: {
            source: "{that}.options.templateLoader",
            removeSource: true,
            target: "{that > templateLoader}.options"
        }
    });

})(jQuery, fluid);
