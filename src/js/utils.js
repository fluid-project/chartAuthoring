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
    gpii.d3.jQueryToD3 = function (domElem) {
        return d3.selectAll(domElem.toArray());
    };

    gpii.d3.addD3Listeners = function (elem, eventName, listener, that) {
        var d3Elem = that.jQueryToD3(elem);
        d3Elem.on(eventName, function (data, i) {
            fluid.invokeGlobalFunction(listener, [data, i, that]);
        });
    };

    gpii.isCssClass = function (cssClass) {
        cssClass = cssClass.trim();
        var pattern = /^\.[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
        return pattern.test(cssClass);
    };

})(jQuery, fluid);
