/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.chartAuthoring.valueBinding", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit", "{that}.generateModelListenersConnectionGrade"],
        bindings: {},
        invokers: {
            generateModelListenersConnectionGrade: {
                funcName: "gpii.chartAuthoring.valueBinding.generateModelListenersConnectionGrade",
                args: ["{that}.options.bindings", "gpii.chartAuthoring.valueBinding.updateDOM"]
            }
        },
        listeners: {
            "onCreate.bindDOMChange": "gpii.chartAuthoring.valueBinding.bindDOMChange"
        }
    });

    gpii.chartAuthoring.valueBinding.bindDOMChange = function (that) {
        fluid.each(that.options.bindings, function (modelPath, selector) {
            var elm = that.locate(selector);
            elm.on("change", function () {
                that.applier.change(modelPath, elm.val());
            });
        });
    };

    gpii.chartAuthoring.valueBinding.updateDOM = function (elm, value) {
        elm = $(elm);
        elm[elm.is("input") ? "val" : "text"](value);
    };

    gpii.chartAuthoring.valueBinding.generateModelListenersConnectionGrade = function (bindings, handlerName) {
        var gradeName = "gpii.valueBindingModelConnections." + fluid.allocateGuid();
        var modelListeners = {};

        fluid.each(bindings, function (modelPath, selector) {
            modelListeners[modelPath] = modelListeners[modelPath] || [];
            modelListeners[modelPath].push({
                listener: handlerName,
                args: ["{that}.dom." + selector, "{change}.value"]
            });
        });

        fluid.defaults(gradeName, {
            modelListeners: modelListeners
        });

        return gradeName;
    };

})(jQuery, fluid);
