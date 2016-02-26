/*
Copyright 2015-2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.tests");

    jqUnit.test("Test floe.d3.jQueryToD3()", function () {
        jqUnit.expect(3);

        var jQueryContainer = $(".floec-container");
        jqUnit.assertNotUndefined("The source container is a jQuery container", jQueryContainer.jquery);

        var d3Elem = floe.d3.jQueryToD3(jQueryContainer);
        jqUnit.assertUndefined("The source container is a jQuery container", d3Elem[0].jquery);
        jqUnit.assertEquals("The jQuery element has been converted to D3 element", jQueryContainer[0], d3Elem[0][0]);
    });

    floe.tests.mouseOverListenerCalled = false;

    floe.tests.mouseOverListener = function () {
        floe.tests.mouseOverListenerCalled = true;
    };

    jqUnit.test("Test floe.d3.getColorScale()", function () {
        jqUnit.expect(2);

        var container = $(".floec-d3Listener");
        floe.d3.addD3Listeners(container, "mouseover", "floe.tests.mouseOverListener");

        jqUnit.assertFalse("The mouseover listener have not been triggered", floe.tests.mouseOverListenerCalled);
        var d3Container = floe.d3.jQueryToD3(container);
        d3Container.on("mouseover")();
        jqUnit.assertTrue("The mouseover listener have been registered", floe.tests.mouseOverListenerCalled);

    });

    jqUnit.test("Test floe.d3.getColorScale()", function () {
        jqUnit.expect(18);

        var cases = [{
            msg: "Return a proper color scale",
            input: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"],
            expected: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"]
        }, {
            msg: "Return default category10 color scale if the input is undefined",
            input: undefined,
            expected: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
        }];

        fluid.each(cases, function (oneCase) {
            var colorScale = floe.d3.getColorScale(oneCase.input);
            jqUnit.assertEquals("The return color scale is a function", "function", typeof(colorScale));
            var length = oneCase.input ? oneCase.input.length : 10;

            for (var i = 0; i < length; i++) {
                jqUnit.assertEquals(oneCase.msg, oneCase.expected[i], colorScale(i));
            }
        });
    });

    jqUnit.test("Test floe.d3.idExtractor()", function () {
        jqUnit.expect(3);

        var cases = [{
            msg: "Handle d.id scenario",
            input: {id: "id1"},
            expected: "id1"
        },
        {
            msg: "Handle d.data.id scenario",
            input: {data: {id: "id2"}},
            expected: "id2"
        },
        {
            msg: "Handle no id scenario",
            input: {title: "oh gosh, I am not actually a D3 'd' object"},
            expected: undefined
        }];

        fluid.each(cases, function (oneCase) {
            var extractedId = floe.d3.idExtractor(oneCase.input);
            jqUnit.assertEquals(oneCase.msg, oneCase.expected, extractedId);
        });

    });

})(jQuery, fluid);
