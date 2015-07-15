/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.tests.chartAuthoring.templateInjection", {
        gradeNames: ["gpii.chartAuthoring.templateInjection", "autoInit"],
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
        var that = gpii.tests.chartAuthoring.templateInjection(".gpiic-ca-templateInjection");

        jqUnit.exists("The injected markup should exist", that.locate("injected"));
    });

})(jQuery, fluid);
