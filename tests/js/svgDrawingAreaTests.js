/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* global fluid, floe, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.tests");

    jqUnit.test("Test createBaseSVGDrawingArea function", function () {
        jqUnit.expect(5);

        var that = floe.svgDrawingArea(".floec-svgDrawingArea-baseSVG");

        that.createBaseSVGDrawingArea();

        var svg = that.locate("svg"),
            svgTitleId = that.locate("title").attr("id"),
            svgDescId = that.locate("description").attr("id"),
            svgAriaLabelledByAttr = svg.attr("aria-labelledby");

        jqUnit.assertEquals("The width is set correctly on the SVG", that.options.svgOptions.width, Number(svg.attr("width")));
        jqUnit.assertEquals("The height is set correctly on the SVG", that.options.svgOptions.height, Number(svg.attr("height")));

        jqUnit.assertEquals("The SVG's title has been created", that.model.svgTitle, that.locate("title").text());
        jqUnit.assertEquals("The SVG's description has been created", that.model.svgDescription, that.locate("description").text());
        jqUnit.assertDeepEq("The SVG's title and description are connected through the aria-labelledby attribute of the SVG", svgAriaLabelledByAttr, svgTitleId + " " + svgDescId);
    });

    jqUnit.test("Test getViewBoxConfiguration function", function () {
        jqUnit.expect(1);

        var expectedViewBoxConfig = "0,0,300,500";

        var getViewBoxConfigurationOutput = floe.svgDrawingArea.getViewBoxConfiguration(0, 0, 300, 500);

        jqUnit.assertEquals("function output matches expected format", expectedViewBoxConfig, getViewBoxConfigurationOutput);
    });

})(jQuery, fluid);
