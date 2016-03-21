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

    // Mix-in grade for y axis

    fluid.defaults("floe.chartAuthoring.lineChart.yAxis", {
        model: {
            dataSet: []
        },
        selectors: {
            yAxis: ".floec-ca-lineChart-y-axis"
        },
        events: {
            onChartCreated: null,  // Fire when the line is created. Ready to register D3 DOM event listeners,
            onDraw: null
        },
        listeners: {
            "onDraw.drawYAxis": {
                func: "{that}.drawYAxis",
                priority: "before:drawChartLine"
            }
        },
        invokers: {
            drawYAxis: {
                funcName: "floe.chartAuthoring.lineChart.yAxis.drawYAxis",
                args: ["{that}"]
            }
        }
    });

    floe.chartAuthoring.lineChart.yAxis.drawYAxis = function (that) {
        var yAxisClass = that.classes.yAxis,
            padding = that.options.lineOptions.padding,
            axisTransform = "translate(" + padding + ",0)",
            yAxis = floe.chartAuthoring.lineChart.yAxis.getYAxis(that);

        floe.chartAuthoring.lineChart.timeSeries.manageAxis(that, "yAxis", yAxisClass, axisTransform, yAxis);

    };

    floe.chartAuthoring.lineChart.yAxis.getYScale = function (that) {
        var height = that.options.svgOptions.height;
        var padding = that.options.lineOptions.padding;
        var dataSet = that.model.wrappedDataSet;

        // Create an array consisting of all the values in every dataset array
        var combinedData = fluid.accumulate(dataSet, floe.chartAuthoring.lineChart.timeSeries.concatData, []);

        // Get the max value of that combined array
        var maxValue = d3.max(combinedData, function (d) {
            return d.value;
        });

        // Scale based on that max

        return d3.scale.linear()
            .domain([0, maxValue])
            .nice()
            .range([height - padding, padding]);
    };

    floe.chartAuthoring.lineChart.yAxis.getYAxis = function (that) {
        var width = that.options.svgOptions.width;
        var padding = that.options.lineOptions.padding;
        var yScale = floe.chartAuthoring.lineChart.yAxis.getYScale(that);

        var yAxis = d3.svg.axis()
            .orient("left")
            .scale(yScale)
            .innerTickSize(- width + padding * 3)
            .outerTickSize(0)
            .tickPadding(10);

        return yAxis;
    };

})(jQuery, fluid);
