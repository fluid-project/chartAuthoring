/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/floe/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("floe.chartAuthoring.templateInjection", {
        gradeNames: ["fluid.viewComponent"],
        listeners: {
            "onCreate.injectTemplate": {
                "this": "{that}.container",
                "method": "html",
                "args": ["{that}.options.resources.template.resourceText"],
                "priority": "first"
            }
        },
        // Integrators need to specify the resource text to use as the HTML template
        resources: {
            template: {
                resourceText: ""
            }
        }
    });

})(jQuery, fluid);
