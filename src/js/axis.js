/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* global fluid, floe */

(function ($, fluid) {

    "use strict";

    // Mix-in grade for axis management
    // should be added to any chart that wishes
    // to include one or more axis elements

    fluid.defaults("floe.chartAuthoring.axis", {
        invokers: {
            manageAxis: {
                funcName: "floe.chartAuthoring.axis.manageAxis",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            }
        }
    });

    floe.chartAuthoring.axis.manageAxis = function (that, axisSelector, axisClass, axisTransform, axisFunction) {

        var transitionLength = that.options.lineOptions.transitionLength;

        var noAxisExists = that.locate(axisSelector).length === 0;

        if (noAxisExists) {
            // Append the axis if it's not drawn yet
            that.svg.append("g")
                .attr({
                    "transform": axisTransform,
                    "class": axisClass
                })
                .call(axisFunction);
        } else {
            // Transition the axis if it's already drawn
            floe.d3.jQueryToD3(that.locate(axisSelector))
                .transition()
                .duration(transitionLength)
                .call(axisFunction);
        }

    };

})(jQuery, fluid);
