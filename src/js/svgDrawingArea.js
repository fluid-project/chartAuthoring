/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    // A base SVG drawing area component
    // Creates a basic SVG drawing area for use by implementing grades that actually
    // draw charts; includes hooks for accessible title and description in model

    fluid.defaults("floe.svgDrawingArea", {
        gradeNames: ["floe.d3ViewComponent"],
        model: {
            svgTitle: "An SVG",
            svgDescription: "An SVG image"
        },
        // Options controlling the behaviour of the base SVG drawing area
        svgOptions: {
            width: 500,
            height: 500
        },
        selectors: {
            title: ".floec-ca-svgDrawingArea-title",
            description: ".floec-ca-svgDrawingArea-description",
            svg: ".floec-ca-svgDrawingArea-svg"
        },
        invokers: {
            createBaseSVGDrawingArea: {
                funcName: "floe.svgDrawingArea.createBaseSVGDrawingArea",
                args: ["{that}"]
            }

        }
    });

    // Returns a properly formatted viewBox attribute that helps in making
    // SVG elements scalable
    // https://sarasoueidan.com/blog/svg-coordinate-systems/ has a lengthy
    // explanation

    floe.svgDrawingArea.getViewBoxConfiguration = function (x, y, width, height) {
        return x + "," + y + "," + width + "," + height;
    };

    // Given width, height and class, creates an initial SVG to draw in,
    // and appends tags and attributes for alternative representation
    floe.svgDrawingArea.createBaseSVGDrawingArea = function (that) {
        var container = that.container,
            width = that.options.svgOptions.width,
            height = that.options.svgOptions.height,
            titleClass = that.classes.title,
            descriptionClass = that.classes.description,
            svgClass = that.classes.svg;

        that.svg = that.jQueryToD3(container)
            .append("svg")
            .attr({
                "width": width,
                "height": height,
                "class": svgClass,
                "viewBox": floe.svgDrawingArea.getViewBoxConfiguration(0, 0, width, height),
                // Set aria role to image - this causes the chart to appear as a
                // static image to AT rather than as a number of separate
                // images
                "role": "img"
            });

        that.svg
            .append("title")
            .attr({
                "class": titleClass
            })
            .text(that.model.svgTitle);

        // Allocate ID for the title element
        var svgTitleId = fluid.allocateSimpleId(that.locate("title"));

        that.svg
            .append("desc")
            .attr({
                "class": descriptionClass
            })
            .text(that.model.svgDescription);

        // Allocate ID for the desc element
        var svgDescId = fluid.allocateSimpleId(that.locate("description"));

        // Now that they've been created and have IDs, explicitly associate SVG
        // title & desc via aria-labelledby
        that.svg.attr({
            "aria-labelledby": svgTitleId + " " + svgDescId
        });
    };

})(jQuery, fluid);
