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

    jqUnit.test("Test gpii.d3.jQueryToD3()", function () {
        jqUnit.expect(3);

        var jQueryContainer = $(".gpiic-container");
        jqUnit.assertNotUndefined("The source container is a jQuery container", jQueryContainer.jquery);

        var d3Elem = gpii.d3.jQueryToD3(jQueryContainer);
        jqUnit.assertUndefined("The source container is a jQuery container", d3Elem[0].jquery);
        jqUnit.assertEquals("The jQuery element has been converted to D3 element", jQueryContainer[0], d3Elem[0][0]);
    });

    gpii.tests.mouseOverListenerCalled = false;

    gpii.tests.mouseOverListener = function (data, i, that) {
        gpii.tests.mouseOverListenerCalled = true;
    };

    jqUnit.test("Test gpii.d3.addD3Listeners()", function () {
        jqUnit.expect(2);

        var container = $(".gpiic-d3Listener");
        gpii.d3.addD3Listeners(container, "mouseover", "gpii.tests.mouseOverListener");

        jqUnit.assertFalse("The mouseover listener have not been triggered", gpii.tests.mouseOverListenerCalled);
        var d3Container = gpii.d3.jQueryToD3(container);
        d3Container.on("mouseover")();
        jqUnit.assertTrue("The mouseover listener have been registered", gpii.tests.mouseOverListenerCalled);

    });

})(jQuery, fluid);
