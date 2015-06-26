/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    /*
    <input type="text" class="gpiic-ca-valueEntry-valueInput">
    <span class="gpiic-ca-valueEntry-percentage"></span>
    <input type="text" class="gpiic-ca-valueEntry-description">
    */

    fluid.defaults("gpii.chartAuthoring.valueEntry", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        selectors: {
            input: ".gpiic-ca-valueEntry-input",
            percentage: ".gpiic-ca-valueEntry-percentage",
            description: ".gpiic-ca-valueEntry-description"
        },
        strings: {
            inputPlaceholder: "Value",
            descriptionPlacholder: "Description (max of 30 characters)"
        },
        listeners: {
            "onCreate.setInputAttrs": {
                "this": "{that}.dom.input",
                "method": "attr",
                "args": {
                    placeholder: "{that}.options.strings.inputPlaceholder"
                }
            },
            "onCreate.setDescriptionAttrs": {
                "this": "{that}.dom.description",
                "method": "attr",
                "args": {
                    placeholder: "{that}.options.strings.descriptionPlacholder",
                    maxlength: "{that}.options.descriptionMaxLength",
                    size: {
                        expander: {
                            funcName: "Math.max",
                            args: ["{that}.options.strings.descriptionPlacholder.length", "{that}.options.descriptionMaxLength"]
                        }
                    }
                }
            }
        },
        descriptionMaxLength: 30
    });

})(jQuery, fluid);
