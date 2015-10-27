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

    fluid.registerNamespace("floe.tests.utils");

    floe.tests.utils.triggerChangeEvent = function (elm, value) {
        elm = $(elm);
        elm.val(value);
        elm.change();
    };

    floe.tests.utils.matrixTest = function (inputs, testFn) {
        fluid.each(inputs, function (row, rowIdx) {
            fluid.each(inputs, function (col, colIdx) {
                testFn(col, row, colIdx , rowIdx);
            });
        });
    };
})(jQuery, fluid);
