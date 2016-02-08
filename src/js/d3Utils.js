/*
Copyright 2015-2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.d3");

    /**
     * Convert jQuery DOM elements to D3 DOM elements.
     * @param domElem - a jQuery DOM element or an array of jQuery DOM elements
     */
    floe.d3.jQueryToD3 = function (elem) {
        return d3.selectAll(elem.toArray());
    };

    /* Given the object "d", returns value of:
     * - "id" if it exists on the top-level object,
     * - "data.id" if it exists on a "data" object
     * - "undefined" if neither of these exist
     */
    floe.d3.idExtractor = function (d) {
        return fluid.get(d, "id") || fluid.get(d, "data.id");
    };

    // Given a selection of D3 elements and an ID, returns only the elements
    // matching that ID
    floe.d3.filterByDataId = function (d3Selection, idToFilter, invertResult) {
        var shouldInvert = invertResult === undefined ? false : invertResult;
        return d3Selection.filter(
            function (d) {
                var id = floe.d3.idExtractor(d);
                return shouldInvert ? id !== idToFilter : id === idToFilter;
            }
        );
    };

    // Given an array "elements" consisting of element IDs, returns a joined
    // string of IDs suitable for use as a jQuery selector
    floe.d3.getElementIdsAsSelector = function(elementIds) {
        if(fluid.isArrayable(elementIds)) {
            var elemIdCollectionWithPreface = fluid.transform(elementIds, function(elemId) {
                    return "#" + elemId;
            });
            var keyedElements = elemIdCollectionWithPreface.join(",");
            return keyedElements;
        }
        return undefined;
    };

    // Given a D3 data key, return the affiliated D3-bound elements using the model's
    // dataKeys information
    // TODO: test
    floe.d3.getElementsByDataKey = function(dataKey, that) {
        var elemIdCollection = that.model.dataKeys[dataKey];
        return $(floe.d3.getElementIdsAsSelector(elemIdCollection));
    };

    // Given a D3 data key, returns all D3-bound elements that aren't associated
    // with that key
    // TOOD: test

    floe.d3.getElementsNotMatchingDataKey = function(dataKey, that) {
        var dataKeys = that.model.dataKeys;
        var matchedElements = [];
        fluid.each(dataKeys, function(elementIds, currentKey) {
            if(currentKey !== dataKey) {
                var selector = floe.d3.getElementIdsAsSelector(elementIds);
                matchedElements.push(selector);
            }
        });
        return $(matchedElements.join(","));
    };

    // Given a selection of D3 elements, an ID and a CSS class, turns that
    // class on for any elements matching the ID and makes sure it's turn off
    // for any elements not matching it
    // TODO: needs test coverage outside of overall chartAuthoring tests
    floe.d3.toggleCSSClassByDataId = function (d3Selection, id, toggleClass, that) {
        var associatedElements = floe.d3.getElementsByDataKey(id, that);

        if(associatedElements !== undefined) {
            associatedElements.addClass(toggleClass);
            associatedElements.each(function (idx, elem) {
                elem.classList.add(toggleClass);
            });
        }

        var unassociatedElements = floe.d3.getElementsNotMatchingDataKey(id, that);

        if(unassociatedElements !== undefined) {
            unassociatedElements.removeClass(toggleClass);
            unassociatedElements.each(function (idx, elem) {
                elem.classList.remove(toggleClass);
            });
        }
    };

    floe.d3.addD3Listeners = function (jQueryElem, eventName, listener, that) {
        var d3Elem = floe.d3.jQueryToD3(jQueryElem);
        d3Elem.on(eventName, function (data, i) {
            fluid.invokeGlobalFunction(listener, [data, i, that]);
        });
    };

    /**
     * Return a D3 color scale based on user supplied colors or the d3.scale.category10() defaults
     * d3.scale.category10() constructs a new ordinal scale with a range of ten categorical colors:
     * @param an array of color codes or undefined
     * @return - a D3 color scale
     */
    floe.d3.getColorScale = function (colors) {
        return colors ? d3.scale.ordinal().range(colors) : d3.scale.category10();
    };

})(jQuery, fluid);
