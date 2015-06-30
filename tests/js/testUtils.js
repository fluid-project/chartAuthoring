/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.tests.utils");

    gpii.tests.utils.triggerChangeEvent = function (elm, value) {
        elm = $(elm);
        elm.val(value);
        elm.change();
    };

})(jQuery, fluid);
