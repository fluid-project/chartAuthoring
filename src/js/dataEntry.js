/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.chartAuthoring.dataEntry", {
        gradeNames: ["fluid.viewRelayComponent", "gpii.chartAuthoring.valueBinding", "autoInit"],
        selectors: {
            input: ".gpiic-ca-dataEntry-input",
            percentage: ".gpiic-ca-dataEntry-percentage",
            description: ".gpiic-ca-dataEntry-description"
        },
        strings: {
            inputPlaceholder: "Value",
            descriptionPlacholder: "Description (max of 30 characters)",
            percentage: "%percentage%"
        },
        model: {
            value: null,
            description: "",
            total: ""
        },
        bindings: {
            input: "input",
            description: "description"
        },
        descriptionMaxLength: 30,
        invokers: {
            calculatePercentage: {
                funcName: "gpii.chartAuthoring.percentage.calculate",
                args: ["{that}.model.value", "{that}.model.total"]
            },
            getPercentageToRender: {
                funcName: "gpii.chartAuthoring.percentage.percentageIfValue",
                args: ["{that}.calculatePercentage", "{that}.model.value", ""]
            },
            setPercentage: {
                funcName: "gpii.chartAuthoring.percentage.render",
                args: ["{that}.dom.percentage", "{that}.getPercentageToRender", "{that}.options.strings.percentage"]
            }
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
        modelListeners: {
            "value": "{that}.setPercentage",
            "total": "{that}.setPercentage"
        }
    });

})(jQuery, fluid);
