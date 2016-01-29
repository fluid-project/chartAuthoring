/*
Copyright 2016 OCAD University

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
        return d.id !== undefined ? d.id : d.data !== undefined ? d.data.id !== undefined? d.data.id : undefined : undefined;
    };

    // Given a selection of D3 elements and an ID, returns only the elements
    // matching that ID
    floe.d3.filterById = function (d3Selection, currentlyPlayingDataId) {
        return d3Selection.filter(
            function(d) {
                var id = floe.d3.idExtractor(d);
                return id === currentlyPlayingDataId;
            }
        );
    };

    // Given a selection of D3 elements and an ID, returns only the elements
    // that don't match that ID
    floe.d3.filterByNotId = function (d3Selection, currentlyPlayingDataId) {
        return d3Selection.filter(
            function(d) {
                var id = floe.d3.idExtractor(d);
                return id !== currentlyPlayingDataId;
            }
        );
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
