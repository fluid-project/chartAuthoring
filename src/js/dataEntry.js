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
            label: ".gpiic-ca-dataEntry-label"
        },
        strings: {
            inputPlaceholder: "Value",
            percentage: "%percentage%"
        },
        model: {
            // value: number
            label: ""
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
            label: "label"
        },
        invokers: {
            getPercentageToRender: {
                funcName: "gpii.chartAuthoring.percentage.percentageIfValue",
                args: ["{that}.model.percentage", "{that}.model.value", ""]
            },
            setPercentage: {
                funcName: "gpii.chartAuthoring.percentage.render",
                args: [
                    "{that}.dom.percentage",
                    {
                        expander: {
                            func: "{that}.getPercentageToRender"
                        }
                    },
                    "{that}.options.strings.percentage",
                    2
                ],
                dynamic: true
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
