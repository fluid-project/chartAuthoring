/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/floe/universal/LICENSE.txt
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
