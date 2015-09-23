/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.d3");

    /**
     * Convert jQuery DOM elements to D3 DOM elements.
     * @param domElem - a jQuery DOM element or an array of jQuery DOM elements
     */
    gpii.d3.jQueryToD3 = function (elem) {
        return d3.selectAll(elem.toArray());
    };

    gpii.d3.addD3Listeners = function (jQueryElem, eventName, listener, that) {
        var d3Elem = gpii.d3.jQueryToD3(jQueryElem);
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
    gpii.d3.getColorScale = function (colors) {
        return colors ? d3.scale.ordinal().range(colors) : d3.scale.category10();
    };

})(jQuery, fluid);
