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

    fluid.defaults("gpii.tests.d3ViewComponent", {
        gradeNames: ["gpii.d3ViewComponent", "autoInit"],
        listeners: {
            "onCreate.addMouseoverListener": {
                listener: "{that}.addD3Listeners",
                args: ["{that}.container", "mouseover", "gpii.tests.mouseOverListener"]
            }
        },
        members: {
            mouseOverListenerCalled: false
        }
    });

    gpii.tests.mouseOverListener = function (data, i, that) {
        that.mouseOverListenerCalled = true;
    };

    jqUnit.test("Test d3ViewComponent API", function () {
        jqUnit.expect(3);

        var that = gpii.tests.d3ViewComponent(".gpiic-d3");

        // The D3 DOM event listener is registered
        jqUnit.assertFalse("The mouseover listener for pie slices have not been triggered", that.mouseOverListenerCalled);

        var d3Elem = that.jQueryToD3(that.container);
        jqUnit.assertEquals("The jQuery element has been converted to D3 element", that.container[0], d3Elem[0][0]);

        d3Elem.on("mouseover")();
        jqUnit.assertTrue("The mouseover listener for pie slices have been registered", that.mouseOverListenerCalled);
    });

    jqUnit.test("Test gpii.d3ViewComponent.extractSelectorName()", function () {
        jqUnit.expect(2);

        var cases = [{
            msg: "Correctly extract the string that has one period at the start of the input",
            input: ".gpii-ca",
            expected: "gpii-ca"
        }, {
            msg: "The input string is trimmed",
            input: "   .gpii-ca   ",
            expected: "gpii-ca"
        }];

        fluid.each(cases, function (oneCase) {
            jqUnit.assertEquals(oneCase.msg, oneCase.expected, gpii.d3ViewComponent.extractSelectorName(oneCase.input));
        });
    });

    jqUnit.test("Test gpii.d3ViewComponent.removeArrayDuplicates()", function () {
        jqUnit.expect(2);

        var cases = [{
            msg: "An array of unique values is unchanged",
            input: ["a","b","c","d",2],
            expected: ["a","b","c","d",2]
        },
        {
            msg: "An array containing duplicate values is changed to contain only one instance of each value",
            input: ["apples","bananas","bananas","clementines"],
            expected:["apples","bananas","clementines"]
        }];

        fluid.each(cases, function (oneCase) {
            jqUnit.assertDeepEq(oneCase.msg, oneCase.expected, gpii.d3ViewComponent.removeArrayDuplicates(oneCase.input));
        });
    });

    jqUnit.test("Test gpii.d3ViewComponent.isCssClass()", function () {
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
            jqUnit[oneCase.expected ? "assertTrue" : "assertFalse"](oneCase.msg, gpii.d3ViewComponent.isCssClass(oneCase.input));
        });
    });

    jqUnit.test("Test gpii.d3ViewComponent.synthesizeClasses()", function () {
        jqUnit.expect(7);

        var cases = [{
            msg: "When the styles block having extra elements",
            styles: {
                a: "b c",
                b: "any string"
            },
            selectors: {
                a: ".a"
            },
            expected: {
                a: "a b c",
                b: "any string"
            }
        }, {
            msg: "When the selectors block having extra elements",
            styles: {
                a: "b c"
            },
            selectors: {
                a: ".a",
                b: ".d"
            },
            expected: {
                a: "a b c",
                b: "d"
            }
        }, {
            msg: "When the styles block is missing",
            selectors: {
                a: ".a"
            },
            expected: {
                a: "a"
            }
        }, {
            msg: "When the selectors block is missing",
            styles: {
                a: "b c",
                b: "any string"
            },
            expected: {
                a: "b c",
                b: "any string"
            }
        }, {
            msg: "When the style and selector values are the same",
            styles: {
                a: "_abc",
                b: "efg"
            },
            selectors: {
                a: "._abc",
                b: ".efg"
            },
            expected: {
                a: "_abc",
                b: "efg"
            }
        }, {
            msg: "When the styles and selector values contain some common and some unique elements",
            styles: {
                a: "e_1 g",
                b: "g h-2"
            },
            selectors: {
                a: ".e_1",
                b: ".h-2"
            },
            expected: {
                a: "e_1 g",
                b: "h-2 g"
            }
        }, {
            msg: "When using gpiic/gpii selectors/styles, Infusion ordering convention is maintained",
            styles: {
                a: "gpii-abc1 gpii-abc2",
                b: "gpii-efg3 gpii-efg4"
            },
            selectors: {
                a: ".gpiic-abc",
                b: ".gpiic-efg"
            },
            expected: {
                a: "gpiic-abc gpii-abc1 gpii-abc2",
                b: "gpiic-efg gpii-efg3 gpii-efg4"
            }
        }];

        fluid.each(cases, function (oneCase) {
            jqUnit.assertDeepEq(oneCase.msg, oneCase.expected, gpii.d3ViewComponent.synthesizeClasses(oneCase.styles, oneCase.selectors));
        });
    });

})(jQuery, fluid);
