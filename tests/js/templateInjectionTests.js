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

    fluid.defaults("floe.tests.chartAuthoring.templateInjection", {
        gradeNames: ["floe.chartAuthoring.templateInjection"],
        selectors: {
            injected: ".injected"
        },
        resources: {
            template: {
                resourceText: "<span class=\"injected\">Injected Markup</span>"
            }
        }
    });

    jqUnit.test("Template Injection", function () {
        var that = floe.tests.chartAuthoring.templateInjection(".floec-ca-templateInjection");

        jqUnit.exists("The injected markup should exist", that.locate("injected"));
    });

})(jQuery, fluid);
