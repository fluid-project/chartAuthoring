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
            value: "",
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
                funcName: "gpii.chartAuthoring.dataEntry.calculatePercentage",
                args: ["{that}.model.value", "{that}.model.total"]
            },
            setPercentage: {
                funcName: "gpii.chartAuthoring.dataEntry.setPercentage",
                args: ["{that}", "{that}.calculatePercentage"]
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

    gpii.chartAuthoring.dataEntry.calculatePercentage = function (value, total) {
        value = parseInt(value, 10) || 0;
        total = parseInt(total, 10) || 1;
        return (value / total) * 100;
    };

    gpii.chartAuthoring.dataEntry.setPercentage = function (that, calculatePercentageFn) {
        var elm = that.locate("percentage");
        // only output a percentage if the value has been specified.
        var percentage = that.model.value ? calculatePercentageFn() : "";

        var output = fluid.stringTemplate(that.options.strings.percentage, {percentage: percentage});
        elm.text(output);
    };

})(jQuery, fluid);
