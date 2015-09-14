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
        gradeNames: ["gpii.chartAuthoring.templateInjection", "gpii.chartAuthoring.valueBinding"],
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
            value: null,
            label: "",
            perecentage: null,
            total: null
        },
        modelRelay: [{
            source: "value",
            target: "value",
            singleTransform: {
                type: "gpii.chartAuthoring.transforms.stringToNumber"
            }
        },{
            source: "",
            target: "percentage",
            singleTransform: {
                type: "gpii.chartAuthoring.transforms.percentage",
                value: "{that}.model.value",
                total: "{that}.model.total"
            }
        }],
        bindings: {
            input: "value",
            label: "label"
        },
        percentageDigits: 2,
        invokers: {
            updatePercentage: {
                funcName: "gpii.chartAuthoring.percentage.render",
                args: [
                    "{that}.dom.percentage",
                    "{that}.model.percentage",
                    "{that}.options.strings.percentage",
                    "{that}.options.percentageDigits"
                ]
            }
        },
        listeners: {
            "onCreate.updatePercentage": "{that}.updatePercentage",
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
                listener: "{that}.updatePercentage",
                excludeSource: "init"
            },
            "total": {
                listener: "{that}.updatePercentage",
                excludeSource: "init"
            }
        }
    });

})(jQuery, fluid);
