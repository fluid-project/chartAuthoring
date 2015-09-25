/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/floe/universal/LICENSE.txt
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
