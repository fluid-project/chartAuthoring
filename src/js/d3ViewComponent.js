/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    // The D3 view component that is able to:
    // 1. convert jQuery DOM elements to D3 elements;
    // 2. register D3 DOM event listeners;
    // 3. Synthesize that.options.styles and that.options.selectors to combine elements with the same key into that.classes

    fluid.defaults("gpii.d3ViewComponent", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        members: {
            classes: {
                expander: {
                    funcName: "gpii.d3ViewComponent.synthesizeClasses",
                    args: ["{that}.options.styles", "{that}.options.selectors"]
                }
            }
        },
        invokers: {
            jQueryToD3: {
                funcName: "gpii.d3.jQueryToD3",
                args: ["{arguments}.0"]
            },
            addD3Listeners: {
                funcName: "gpii.d3.addD3Listeners",
                args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
            }
        }
    });

    // Validate the given selector to ensure it is indeed of the form "period plus classname" since the element
    // is achieved through adding a classname via the d3 "class" directivethe and the current implementation
    // couldn't handle any other form.
    gpii.d3ViewComponent.extractSelectorName = function (selector) {
        if (!selector) {
            return null;
        }

        selector = selector.trim();
        var numOfPeriod = (selector.match(/\./g) || []).length;
        var numOfSpace = (selector.match(/\s/g) || []).length;
        return selector.substring(0, 1) === "." && numOfPeriod === 1 && numOfSpace === 0 ? selector.substring(1) : null;
    };

    // Synthesize "styles" and "selectors" blocks to combine elements with the same key
    gpii.d3ViewComponent.synthesizeClasses = function (styles, selectors) {
        var result = {};

        fluid.each(styles, function (styleValue, key) {
            var correspondingSelector = fluid.get(selectors, key),
                selectorName = gpii.d3ViewComponent.extractSelectorName(correspondingSelector),
                concatenated = selectorName ? selectorName.concat(" " + styleValue) : styleValue;
            fluid.set(result, key, concatenated);
        });

        fluid.each(selectors, function (selector, key) {
            var correspondingStyle = fluid.get(styles, key);
            if (!correspondingStyle) {
                var selectorName = gpii.d3ViewComponent.extractSelectorName(selector);
                if (selectorName) {
                    fluid.set(result, key, selectorName);
                }
            }
        });

        return result;
    };

})(jQuery, fluid);
