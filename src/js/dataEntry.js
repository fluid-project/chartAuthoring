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
        gradeNames: ["gpii.chartAuthoring.templateInjection", "gpii.chartAuthoring.valueBinding", "autoInit"],
        selectors: {
            input: ".gpiic-ca-dataEntry-value",
            percentage: ".gpiic-ca-dataEntry-percentage",
            description: ".gpiic-ca-dataEntry-label"
        },
        strings: {
            inputPlaceholder: "Value",
            descriptionPlaceholder: "Description (max of 30 characters)",
            percentage: "%percentage%"
        },
        model: {
            // value: number
            description: ""
            // perecentage: number
            // total: number
        },
        modelRelay: {
            source: "",
            target: "percentage",
            singleTransform: {
                type: "fluid.transforms.free",
                args: [
                    "{that}.model.value",
                    "{that}.model.total"
                ],
                func: "gpii.chartAuthoring.dataEntry.calculatePercentage"
            }
        },
        bindings: {
            input: "value",
            description: "description"
        },
        descriptionMaxLength: 30,
        invokers: {
            getPercentageToRender: {
                funcName: "gpii.chartAuthoring.percentage.percentageIfValue",
                args: ["{that}.model.percentage", "{that}.model.value", ""]
            },
            setPercentage: {
                funcName: "gpii.chartAuthoring.percentage.render",
                args: ["{that}.dom.percentage", "{that}.getPercentageToRender", "{that}.options.strings.percentage"]
            }
        },
        listeners: {
            "onCreate.setPercentage": "{that}.setPercentage",
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
                    placeholder: "{that}.options.strings.descriptionPlaceholder",
                    maxlength: "{that}.options.descriptionMaxLength",
                    size: {
                        expander: {
                            funcName: "Math.max",
                            args: ["{that}.options.strings.descriptionPlaceholder.length", "{that}.options.descriptionMaxLength"]
                        }
                    }
                }
            }
        },
        modelListeners: {
            "value": {
                listener: "{that}.setPercentage",
                excludeSource: "init"
            },
            "total": {
                listener: "{that}.setPercentage",
                excludeSource: "init"
            }
        }
    });

    gpii.chartAuthoring.dataEntry.calculatePercentage = function (value, total) {
        var percentage = gpii.chartAuthoring.percentage.calculate(value, total);
        return fluid.isValue(percentage) ? percentage : "";
    };

})(jQuery, fluid);
