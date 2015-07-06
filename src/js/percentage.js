/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.chartAuthoring.percentage");

    gpii.chartAuthoring.percentage.calculate = function (value, total) {
        value = parseFloat(value, 10) || 0;
        total = parseFloat(total, 10) || 1;
        return (value / total) * 100;
    };

    gpii.chartAuthoring.percentage.retrieveVal = function (val) {
        return typeof(val) === "function" ? val() : val;
    };

    /**
     * Renders the percentage into a DOM element.
     * @param elm - a jQueryable selector representing the element(s) to set the percentage on
     * @param perencentage {Number/String/Function} - Either a Number/String representation of the
     * perencentage, or a function that returns it. *Note: No arguments are passed into the function*
     * @param template {String} - an optional string template to use for rendering the percentage. By
     * default only the percentage value is rendered.
     */
    gpii.chartAuthoring.percentage.render = function (elm, percentage, template) {
        elm = $(elm);
        template = template || "%percentage";
        percentage = gpii.chartAuthoring.percentage.retrieveVal(percentage);

        var output = fluid.stringTemplate(template, {percentage: percentage});
        elm.text(output);
    };

    //TODO: consider refactoring this into a general function that returns a default value if a condition isn't met.
    // Used to provide a default value if a model or some other value had not been set.
    gpii.chartAuthoring.percentage.percentageIfValue = function (percentage, value, defPercentage) {
        defPercentage = defPercentage || "";
        return !fluid.isValue(value) ? defPercentage : gpii.chartAuthoring.percentage.retrieveVal(percentage);
    };

})(jQuery, fluid);
