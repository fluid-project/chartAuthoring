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

    fluid.registerNamespace("gpii.chartAuthoring.percentage");

    gpii.chartAuthoring.percentage.isNumber = function (value) {
        return typeof (value) === "number" && !isNaN(value);
    };

    /**
     * Calculates a percentage given a value and total.
     * @param value {Number}
     * @param total {Number}
     *
     * @return {Number}  - a floating point number representing the percentage.
     * Will return 0 if the total is 0.
     */
    gpii.chartAuthoring.percentage.calculate = function (value, total) {
        var isValid = gpii.chartAuthoring.percentage.isNumber(value) && gpii.chartAuthoring.percentage.isNumber(total);
        return !isValid ? null : !total ? 0 : (value / total) * 100;
    };

    /**
     * Renders the percentage into a DOM element.
     * @param elm - a jQueryable selector representing the element(s) to set the percentage on
     * @param perencentage {Number/String} - Either a Number or String representation of the
     * perencentage.
     * @param template {String} - an optional string template to use for rendering the percentage. By
     * default only the percentage value is rendered.
     * @param digits {Number} - an optional parameter for how many digits should appear after the decimal point.
     * By default it is 0.
     */
    gpii.chartAuthoring.percentage.render = function (elm, percentage, template, digits) {
        elm = $(elm);
        template = template || "%percentage";

        var numericalPercentage = parseFloat(percentage);

        if (numericalPercentage || numericalPercentage === 0) {
            percentage = numericalPercentage.toFixed(digits);
        } else {
            percentage = "";
        }

        var output = fluid.stringTemplate(template, {percentage: percentage});
        elm.text(output);
    };

})(jQuery, fluid);
