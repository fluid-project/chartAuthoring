/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("floe.chartAuthoring.dataEntry", {
        gradeNames: ["floe.chartAuthoring.templateInjection", "floe.chartAuthoring.valueBinding"],
        selectors: {
            value: ".floec-ca-dataEntry-value",
            percentage: ".floec-ca-dataEntry-percentage",
            label: ".floec-ca-dataEntry-label"
        },
        strings: {
            valueInputPlaceholder: "Value",
            labelInputPlaceholder: "Label",
            percentage: "%percentage%",
            // aria-label attribute for the Value form input
            valueInputAriaLabel: "Value",
            // aria-label attribute for the Label form input
            labelInputAriaLabel: "Label"
        },
        model: {
            value: null,
            label: "",
            percentage: null,
            total: null
        },
        modelRelay: [{
            source: "value",
            target: "value",
            singleTransform: {
                type: "floe.chartAuthoring.transforms.stringToNumber"
            }
        },{
            source: "",
            target: "percentage",
            singleTransform: {
                type: "floe.chartAuthoring.transforms.percentage",
                value: "{that}.model.value",
                total: "{that}.model.total"
            }
        }],
        bindings: {
            value: "value",
            label: "label"
        },
        percentageDigits: 2,
        invokers: {
            updatePercentage: {
                funcName: "floe.chartAuthoring.percentage.render",
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
                "this": "{that}.dom.value",
                "method": "attr",
                "args": {
                    placeholder: "{that}.options.strings.valueInputPlaceholder",
                    "aria-label": "{that}.options.strings.valueInputAriaLabel"
                }
            },
            "onCreate.setLabelAttrs": {
                "this": "{that}.dom.label",
                "method": "attr",
                "args": {
                    placeholder: "{that}.options.strings.labelInputPlaceholder",
                    "aria-label": "{that}.options.strings.labelInputAriaLabel"
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
