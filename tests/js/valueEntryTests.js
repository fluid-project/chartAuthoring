/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.tests.chartAuthoring.valueEntry", {
        gradeNames: ["gpii.chartAuthoring.valueEntry", "autoInit"]
    });

    fluid.defaults("gpii.tests.chartAuthoring.valueEntryTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            valueEntry: {
                type: "gpii.tests.chartAuthoring.valueEntry",
                container: ".gpiic-ca-valueEntry"
            },
            valueEntryTester: {
                type: "gpii.tests.chartAuthoring.valueEntryTester"
            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoring.valueEntryTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Tests the value entry component",
            tests: [{
                expect: 8,
                name: "Test Init",
                type: "test",
                func: "gpii.tests.chartAuthoring.valueEntryTester.testRendering",
                args: ["{valueEntry}"]
            }]
        }]
    });

    gpii.tests.chartAuthoring.valueEntryTester.testRendering = function (that) {
        jqUnit.assertValue("The component should have been initialized.", that);
        fluid.each(that.options.selectors, function (sel, selName) {
            jqUnit.exists("The '" + selName + "' element exists.", that.locate(selName));
        });
        jqUnit.assertEquals("The input placholder has been set", that.options.strings.inputPlaceholder, that.locate("input").attr("placeholder"));
        jqUnit.assertEquals("The description placholder has been set", that.options.strings.descriptionPlacholder, that.locate("description").attr("placeholder"));
        jqUnit.assertEquals("The description's max length should be set", that.options.descriptionMaxLength, that.locate("description").attr("maxlength"));
        var descriptionSize = parseInt(that.locate("description").attr("size"), 10);
        jqUnit.assertTrue("The description's size should be set to a size that will accomodate the maximum description and the placholder text.", descriptionSize >= that.options.descriptionMaxLength && descriptionSize >= that.options.strings.descriptionPlacholder.length);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoring.valueEntryTest"
        ]);
    });

})(jQuery, fluid);
