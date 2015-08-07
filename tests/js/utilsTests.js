/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.tests");

    jqUnit.test("Test gpii.isCssClass()", function () {
        jqUnit.expect(5);

        var cases = [{
            msg: "Correctly extract the string that has one period at the start of the input",
            input: ".gpii-ca",
            expected: true
        }, {
            msg: "More than one periods in the input returns false",
            input: ".gpii-ca.",
            expected: false
        }, {
            msg: "No period at the start of the string returns false",
            input: "gpii-ca.",
            expected: false
        }, {
            msg: "Having spaces in the middle of the input string returns false",
            input: ".gpii-ca .b",
            expected: false
        }, {
            msg: "Having spaces in the middle of the input string returns false",
            input: ".gpii-ca#b",
            expected: false
        }];

        fluid.each(cases, function (oneCase) {
            jqUnit[oneCase.expected ? "assertTrue" : "assertFalse"](oneCase.msg, gpii.isCssClass(oneCase.input));
        });
    });

})(jQuery, fluid);
