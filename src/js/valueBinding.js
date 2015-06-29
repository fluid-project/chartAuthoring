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
        gradeNames: ["fluid.viewRelayComponent", "autoInit", "{that}.generateModelConnectionGrade"],
        bindings: {},
        invokers: {
            generateModelConnectionGrade: {
                funcName: "gpii.chartAuthoring.valueBinding.generateModelConnectionGrade",
                args: ["{that}.options.bindings", "gpii.chartAuthoring.valueBinding.updateDOM"]
            }
        }
    });

    gpii.chartAuthoring.valueBinding.updateDOM = function (elm, value) {
        elm = $(elm);
        elm[elm.is("input") ? "val" : "text"](value);
    };

    gpii.chartAuthoring.valueBinding.generateModelConnectionGrade = function (bindings, handlerName) {
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
