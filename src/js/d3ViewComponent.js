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

        fluid.each(styles, function (styleValue, key) {
            consolidatedClasses[key] = styleValue;
        });

        fluid.each(selectors, function (selector, key) {
            if(consolidatedClasses[key]) {
                consolidatedClasses[key] = consolidatedClasses[key] + " " + gpii.d3ViewComponent.extractSelectorName(selector);
            } else {consolidatedClasses[key] = gpii.d3ViewComponent.extractSelectorName(selector);}
        });

        fluid.each(consolidatedClasses, function(classes, key) {
            var splitClasses = classes.split(" ");
            // Basic alphabetic sort to improve readability of applied classes
            splitClasses.sort(function (a,b) {
                if(a < b) {return -1;}
                if(a > b) {return 1;}
                return 0;
            });

            var uniqueClasses = [];

            // Add classes to the uniqueClasses array if they aren't already there
            fluid.each(splitClasses, function(currentClass) {
                if ($.inArray(currentClass, uniqueClasses) === -1) {uniqueClasses.push(currentClass);}
            });
            // Update each key to contain only the unique classes
            consolidatedClasses[key] = uniqueClasses.join(" ");
        });

        return consolidatedClasses;
    };

})(jQuery, fluid);
