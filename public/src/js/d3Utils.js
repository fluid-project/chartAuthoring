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
