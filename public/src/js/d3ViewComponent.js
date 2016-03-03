/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    // The D3 view component that is able to:
    // 1. Convert jQuery DOM elements to D3 elements;
    // 2. Attach D3 DOM event listeners;
    // 3. Synthesize that.options.styles and that.options.selectors to combine elements with the same key into that.classes
    // 4. Create a basic SVG drawing area for use by implementing grades that actually
    // draw charts

    fluid.defaults("floe.d3ViewComponent", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        members: {
            classes: {
                expander: {
                    funcName: "floe.d3ViewComponent.synthesizeClasses",
                    args: ["{that}.options.styles", "{that}.options.selectors"]
                }
            }
        },
        model: {
            // Keeps track of D3 keys and their associated DOM elements
            dataKeys: {},
            svgTitle: "An SVG",
            svgDescription: "An SVG image"
        },
        // Options controlling the behaviour of the base SVG drawing area
        svgOptions: {
            width: 500,
            height: 500
        },
        selectors: {
            title: ".floec-ca-d3ViewComponent-title",
            description: ".floec-ca-d3ViewComponent-description",
            svg: ".floec-ca-d3ViewComponent-svg"
        },
        invokers: {
            jQueryToD3: {
                funcName: "floe.d3.jQueryToD3",
                args: ["{arguments}.0"]
            },
            addD3Listeners: {
                funcName: "floe.d3.addD3Listeners",
                args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
            },
            addElementIdToDataKey: {
                funcName: "floe.d3ViewComponent.addElementIdToDataKey",
                args: ["{arguments}.0", "{arguments}.1", "{that}"]
            },
            removeElementIdFromDataKey: {
                funcName: "floe.d3ViewComponent.removeElementIdFromDataKey",
                args: ["{arguments}.0", "{arguments}.1", "{that}"]
            },
            getElementsByDataKey: {
                funcName: "floe.d3ViewComponent.getElementsByDataKeys",
                args: [["{arguments}.0"], "{that}"]
            },
            trackD3BoundElement: {
                funcName: "floe.d3ViewComponent.trackD3BoundElement",
                args: ["{arguments}.0", "{arguments}.1", "{that}"]
            },
            exitD3Elements: {
                funcName: "floe.d3ViewComponent.exitD3Elements",
                args: ["{arguments}.0", "{that}"]
            },
            createBaseSVGDrawingArea: {
                funcName: "floe.d3ViewComponent.createBaseSVGDrawingArea",
                args: ["{that}"]
            }

        }
    });

    /**
     * Validate the given string is in the form of a css class, such as ".floe-css-name"
     * @param cssClass - string
     * @return - boolean
     */

     // Validate the given selector to ensure it is in the form "period plus classname". The current
     // implementation adds the given classname via the d3 "class" directive, so it couldn't handle
     // selectors in any other forms such as "#foo" or ".foo.bar"

    floe.d3ViewComponent.isCssClass = function (cssClass) {
        cssClass = cssClass.trim();
        var pattern = /^\.[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
        return pattern.test(cssClass);
    };

    floe.d3ViewComponent.extractSelectorName = function (selector) {
        if (!selector) {
            return;
        }
        selector = selector.trim();
        if (floe.d3ViewComponent.isCssClass(selector)) {
            return selector.substring(1);
        } else {
            fluid.fail(selector + " is not a css class");
        }
    };

    floe.d3ViewComponent.removeArrayDuplicates = function (array) {
        return array.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
    };

    // Synthesize "styles" and "selectors" blocks to combine elements with the same key
    floe.d3ViewComponent.synthesizeClasses = function (styles, selectors) {

        // 1. Combine any matching styles and selectors by key into an array of class names

        // Do the selectors first to maintain floec/floe-style ordering

        var consolidatedClasses = fluid.transform(selectors, function (selector) {
            return [floe.d3ViewComponent.extractSelectorName(selector)];
        });

        // Needed catch to handle the result of a nonexistent selectors block meaning object is not initialized
        consolidatedClasses = consolidatedClasses || {};

        // Add any style values to consolidatedClasses

        fluid.each(styles, function (styleValue, key) {
            var resultArray = styleValue.split(" ");
            var correspondingSelectorArray = fluid.get(consolidatedClasses, key);

            if (correspondingSelectorArray) {
                resultArray = correspondingSelectorArray.concat(resultArray);
            }
            // Only keep unique values for each consolidated class array
            var resultArrayWithUniqueValues = floe.d3ViewComponent.removeArrayDuplicates(resultArray);

            fluid.set(consolidatedClasses, key, resultArrayWithUniqueValues);
        });

        // 2. For each key/value pair in the consolidatedClasses object, turn the value from an array
        // to a space-delimited string

        var togo = fluid.transform(consolidatedClasses, function (selectorArray) {
            return selectorArray.join(" ");
        });

        return togo;
    };

    // Returns a formatted string for a numeric data value based on a supplied template
    floe.d3ViewComponent.getTemplatedDisplayValue = function (totalValue, percentageDigits, template, d) {
        var percentage = floe.chartAuthoring.percentage.calculate(d.value, totalValue);
        var percentageForTemplate = percentage !== null ? percentage.toFixed(percentageDigits) : percentage;
        var output = fluid.stringTemplate(template, {label: d.label, value: d.value, percentage: percentageForTemplate, total: totalValue});
        return output;
    };

    // Given a data key used to maintain object constancy in D3, a DOM
    // element with a unique ID and the component, updates the key's
    // value (an array of IDs) to include that ID
    floe.d3ViewComponent.addElementIdToDataKey = function (d3Key, idToAdd, that) {
        var keyPath = ["dataKeys", d3Key, idToAdd];
        that.applier.change(keyPath, true);
    };

    // Corresponding "remove" functionality to addElementIdToDataKey
    floe.d3ViewComponent.removeElementIdFromDataKey = function (d3Key, idToRemove, that) {
        var keyPath = ["dataKeys", d3Key, idToRemove];
        that.applier.change(keyPath, false, "DELETE");
    };

    // Given an array of D3 data keys, returns all affiliated D3-bound elements
    // using the model's dataKeys information
    floe.d3ViewComponent.getElementsByDataKeys = function (dataKeys, that) {

        var accruedSelections;
        var accrueSelection = function (selection) {
            var currSelection = $(selection);
            accruedSelections = accruedSelections !== undefined ? accruedSelections.add(currSelection) : currSelection;
            return accruedSelections;
        };

        fluid.each(dataKeys, function (dataKey) {
            var elementIds = fluid.get(that.model.dataKeys, dataKey);
            var selection = fluid.transform(fluid.keys(elementIds), fluid.byId);
            accruedSelections = fluid.accumulate(selection, accrueSelection, accruedSelections);
        });

        return accruedSelections;
    };

    // Given a selection of D3 elements, an ID and a CSS class, turns that
    // class on for any elements matching the ID and makes sure it's turned off
    // for any elements not matching it
    floe.d3ViewComponent.toggleCSSClassByDataId = function (id, cssClass, that) {
        // Get all D3-bound elements
        var allElements = floe.d3ViewComponent.getElementsByDataKeys(fluid.keys(that.model.dataKeys), that);

        allElements.each(function (idx, elem) {
            var dataId = floe.d3.idExtractor(elem.__data__);
            var shouldHighlight = id === dataId ? true : false;
            $(elem).toggleClass(cssClass, shouldHighlight);
            elem.classList[shouldHighlight ? "add" : "remove"](cssClass);
        });
    };

    // Given a dataKey (d.id / d.data.id, etc) and an element, track the
    // dataKey -> element linkage in the component model
    // Intended for use when binding data with D3
    floe.d3ViewComponent.trackD3BoundElement = function (dataKey, d3Element, that) {
        var elementId = fluid.allocateSimpleId(d3Element);
        that.addElementIdToDataKey(dataKey, elementId);
    };

    // Generic D3 "remove" functionality for DOM elements not needing more
    // complicated exit logic than being untracked from the component
    // model and then removed by D3 from the DOM
    // Expects the results of a D3 exit() selection as the first arg
    floe.d3ViewComponent.exitD3Elements = function (d3ExitSelection, that) {
        d3ExitSelection.each(function (d) {
            that.removeElementIdFromDataKey(floe.d3.idExtractor(d.id), this.id);
        });

        d3ExitSelection.remove();
    };

    // Returns a properly formatted viewBox attribute that helps in making
    // SVG elements scalable
    // https://sarasoueidan.com/blog/svg-coordinate-systems/ has a lengthy
    // explanation

    floe.d3ViewComponent.getViewBoxConfiguration = function (x, y, width, height) {
        return x + "," + y + "," + width + "," + height;
    };

    // Given width, height and class, creates an initial SVG to draw in,
    // and appends tags and attributes for alternative representation
    floe.d3ViewComponent.createBaseSVGDrawingArea = function (that) {
        var container = that.container,
            width = that.options.svgOptions.width,
            height = that.options.svgOptions.height,
            titleClass = that.classes.title,
            descriptionClass = that.classes.description,
            svgClass = that.classes.svg;

        that.svg = that.jQueryToD3(container)
            .append("svg")
            .attr({
                "width": width,
                "height": height,
                "class": svgClass,
                "viewBox": floe.d3ViewComponent.getViewBoxConfiguration(0, 0, width, height),
                // Set aria role to image - this causes the chart to appear as a
                // static image to AT rather than as a number of separate
                // images
                "role": "img"
            });

        that.svg
            .append("title")
            .attr({
                "class": titleClass
            })
            .text(that.model.svgTitle);

        // Allocate ID for the title element
        var svgTitleId = fluid.allocateSimpleId(that.locate("title"));

        that.svg
            .append("desc")
            .attr({
                "class": descriptionClass
            })
            .text(that.model.svgDescription);

        // Allocate ID for the desc element
        var svgDescId = fluid.allocateSimpleId(that.locate("description"));

        // Now that they've been created and have IDs, explicitly associate SVG
        // title & desc via aria-labelledby
        that.svg.attr({
            "aria-labelledby": svgTitleId + " " + svgDescId
        });
    };

})(jQuery, fluid);
