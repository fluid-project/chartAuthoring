/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/floe/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("floe.chartAuthoring.valueBinding", {
        gradeNames: ["fluid.viewComponent", "{that}.generateModelListenersConnectionGrade"],
        // A key/value of selectorName: model.path
        bindings: {},
        invokers: {
            generateModelListenersConnectionGrade: {
                funcName: "floe.chartAuthoring.valueBinding.generateModelListenersConnectionGrade",
                args: ["{that}.options.bindings", "floe.chartAuthoring.valueBinding.updateDOM"]
            },
            bindDOMChange: "floe.chartAuthoring.valueBinding.bindDOMChange"
        },
        listeners: {
            "onCreate.setInitialDOM": "floe.chartAuthoring.valueBinding.setInitialDOM",
            "onCreate.bindDOMChange": "{that}.bindDOMChange"
        }
    });

    floe.chartAuthoring.valueBinding.bindDOMChange = function (that) {
        fluid.each(that.options.bindings, function (modelPath, selector) {
            var elm = that.locate(selector);
            elm.on("change", function () {
                that.applier.change(modelPath, elm.val());
            });
        });
    };

    floe.chartAuthoring.valueBinding.updateDOM = function (elm, value) {
        elm = $(elm);
        elm[elm.is("input") ? "val" : "text"](value);
    };

    floe.chartAuthoring.valueBinding.setInitialDOM = function (that) {
        fluid.each(that.options.bindings, function (modelPath, selector) {
            floe.chartAuthoring.valueBinding.updateDOM(that.locate(selector), fluid.get(that.model, modelPath));
        });
    };

    floe.chartAuthoring.valueBinding.generateModelListenersConnectionGrade = function (bindings, handlerName) {
        var gradeName = "floe.valueBindingModelConnections." + fluid.allocateGuid();
        var modelListeners = {};

        fluid.each(bindings, function (modelPath, selector) {
            modelListeners[modelPath] = modelListeners[modelPath] || [];
            modelListeners[modelPath].push({
                listener: handlerName,
                args: ["{that}.dom." + selector, "{change}.value"],
                excludeSource: "init"
            });
        });

        fluid.defaults(gradeName, {
            modelListeners: modelListeners
        });

        return gradeName;
    };

})(jQuery, fluid);
