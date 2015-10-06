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

    fluid.defaults("floe.chartAuthoring.templateInjection", {
        gradeNames: ["fluid.viewComponent"],
        listeners: {
            "onCreate.injectTemplate": {
                "this": "{that}.container",
                "method": "html",
                "args": ["{that}.options.resources.template.resourceText"],
                "priority": "first"
            },
            "onCreate.templateInjected": {
                "listener": "{that}.events.onTemplateInjected.fire"
            }
        },
        // Integrators need to specify the resource text to use as the HTML template
        resources: {
            template: {
                resourceText: ""
            }
        },
        events: {
            onTemplateInjected: null
        }
    });
})(jQuery, fluid);
