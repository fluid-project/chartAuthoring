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
        gradeNames: ["fluid.viewComponent", "autoInit"],
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
            return;
        }
        selector = selector.trim();
        if (gpii.isCssClass(selector)) {
            return selector.substring(1);
        } else {
            fluid.fail(selector + " is not a css class");
        }
    };

    // Synthesize "styles" and "selectors" blocks to combine elements with the same key
    gpii.d3ViewComponent.synthesizeClasses = function (styles, selectors) {

        var consolidatedClasses = {};

        // 1. Combine any matching styles and selectors by key into a single string of class names

        // Do the selectors first to maintain gpiic/gpii-style ordering
        fluid.each(selectors, function (selector, key) {
            fluid.set(consolidatedClasses, key, gpii.d3ViewComponent.extractSelectorName(selector));
        });

        fluid.each(styles, function (styleValue, key) {
            var correspondingSelector = fluid.get(consolidatedClasses, key);
            if(correspondingSelector) {
                var combinedValues = fluid.get(consolidatedClasses, key) + " " + styleValue;
                fluid.set(consolidatedClasses, key, combinedValues);
            } else {fluid.set(consolidatedClasses, key, styleValue);}

        });

        // 2. For each key in the consolidatedClasses object, split its value into an array of string values separated by spaces,
        // filter for unique strings, and make a new value based on the array of uniques

        fluid.each(consolidatedClasses, function(classes, key) {
            var splitClasses = classes.split(" ");

            var uniqueClasses = [];

            // Add classes to the uniqueClasses array if they aren't already there
            fluid.each(splitClasses, function(currentClass) {
                if ($.inArray(currentClass, uniqueClasses) === -1) {uniqueClasses.push(currentClass);}
            });
            // Update each key to contain only the unique classes by joining the array of uniques
            fluid.set(consolidatedClasses, key, uniqueClasses.join(" "));
        });

        return consolidatedClasses;
    };

})(jQuery, fluid);
