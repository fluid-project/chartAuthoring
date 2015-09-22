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
    // 1. Convert jQuery DOM elements to D3 elements;
    // 2. Attach D3 DOM event listeners;
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

    // Validate the given selector to ensure it is in the form "period plus classname". The current
    // implementation adds the given classname via the d3 "class" directive, so it couldn't handle
    // selectors in any other forms such as "#foo" or ".foo.bar"
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

    gpii.d3ViewComponent.removeArrayDuplicates = function (array) {
        return array.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
    };

    // Synthesize "styles" and "selectors" blocks to combine elements with the same key
    gpii.d3ViewComponent.synthesizeClasses = function (styles, selectors) {

        // 1. Combine any matching styles and selectors by key into an array of class names

        // Do the selectors first to maintain gpiic/gpii-style ordering

        var consolidatedClasses = fluid.transform(selectors, function (selector) {
            return [gpii.d3ViewComponent.extractSelectorName(selector)];
        });

        // Needed catch to handle the result of a nonexistent selectors block meaning object is not initialized
        if(!consolidatedClasses) {
            consolidatedClasses = {};
        }

        // Add any style values to consolidatedClasses

        fluid.each(styles, function (styleValue, key) {
            var resultArray = styleValue.split(" ");
            var correspondingSelectorArray = fluid.get(consolidatedClasses, key);

            if(correspondingSelectorArray) {
                resultArray = correspondingSelectorArray.concat(resultArray);
            }
            // Only keep unique values for each consolidated class array
            var resultArrayWithUniqueValues = gpii.d3ViewComponent.removeArrayDuplicates(resultArray);

            fluid.set(consolidatedClasses, key, resultArrayWithUniqueValues);
        });

        // 2. For each key/value pair in the consolidatedClasses object, turn the value from an array
        // to a space-delimited string

        var togo = fluid.transform(consolidatedClasses, function (selectorArray){
            return selectorArray.join(" ");
        });

        return togo;
    };

})(jQuery, fluid);
