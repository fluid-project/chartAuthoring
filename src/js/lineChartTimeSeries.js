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

    // Draws time series line charts

    fluid.defaults("floe.chartAuthoring.lineChart.timeSeries", {
        gradeNames: ["floe.chartAuthoring.xAxisTimeSeries", "floe.chartAuthoring.yAxis",  "floe.chartAuthoring.lineChart.timeSeries.line",  "floe.chartAuthoring.valueBinding", "floe.svgDrawingArea"],
        model: {
            dataSet: [],
            // See lineTests.js for the style of the dataSets that are
            // allowed
            svgTitle: "Line Chart",
            svgDescription: "A line chart."
        },
        bindings: {
            title: "svgTitle",
            description: "svgDescription"
        },
        svgOptions: {
            width: 700,
            height: 500
        },
        lineOptions: {
            // An array of colors to use for lines drawn from the data
            // Or, a d3 color scale that's generated based off an array of colors
            colors: null,
            // Padding of the chart elements inside the SVG container
            padding: 50,
            // interpolation mode for chart lines and areas
            // see line.interpolate at https://github.com/mbostock/d3/wiki/SVG-Shapes
            // generally, "linear" for sharp lines, "cardinal" for smooth
            interpolation: "linear",
            // In milliseconds
            transitionLength: 2000
        },
        events: {
            onChartCreated: null,  // Fire when the line is created. Ready to register D3 DOM event listeners,
            onDraw: null
        },
        listeners: {
            "onCreate.create": {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.create",
                args: ["{that}"]
            }
        },
        modelListeners: {
            dataSet: [{
                funcName: "{that}.events.onDraw.fire",
                excludeSource: "init"
            }]
        },
        modelRelay: {
            source: "{that}.model.dataSet",
            target: "{that}.model.dataSet",
            singleTransform: {
                type: "fluid.transforms.free",
                args: ["{that}.model.dataSet"],
                func: "floe.chartAuthoring.lineChart.timeSeries.wrapSingleDataSet"
            }
        },
        invokers: {
            getXScale: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.getXScaleTimeSeries",
                args: ["{that}"]
            },
            getYScale: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.getYScale",
                args: ["{that}"]
            }
        }
    });

    // Test if a dataset is multi
    floe.chartAuthoring.lineChart.timeSeries.isMultiDataSet = function (dataSet) {
        return dataSet[0].id !== undefined && dataSet[0].data !== undefined;
    };

    // Wrap a non-multi dataset (a simple array without ID keys) so we can
    // process it with the same function used for multi datasets, and
    // create a default id for it for object constancy
    floe.chartAuthoring.lineChart.timeSeries.wrapSingleDataSet = function (dataSet) {
        if (!floe.chartAuthoring.lineChart.timeSeries.isMultiDataSet(dataSet)) {
            dataSet = [{
                id: "dataSet",
                data: dataSet
            }];
        }
        return dataSet;
    };

    floe.chartAuthoring.lineChart.timeSeries.manageAxis = function (that, axisSelector, axisClass, axisTransform, axisFunction) {

        var transitionLength = that.options.lineOptions.transitionLength;

        var noAxisExists = (that.locate(axisSelector).length > 0) ? false : true;

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
            that.svg.select("." + axisClass)
                .transition()
                .duration(transitionLength)
                .call(axisFunction);
        }

    };

    // Accumulator function for consolidating multiple dataset items together
    // for purposes of determining max/min
    floe.chartAuthoring.lineChart.timeSeries.concatData = function (setItem, accumulationArray) {
        return accumulationArray.concat(setItem.data);
    };

    floe.chartAuthoring.lineChart.timeSeries.getYScale = function (that) {
        var height = that.options.svgOptions.height;
        var padding = that.options.lineOptions.padding;
        var dataSet = that.model.dataSet;

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

    floe.chartAuthoring.lineChart.timeSeries.getXScaleTimeSeries = function (that) {
        var width = that.options.svgOptions.width;
        var padding = that.options.lineOptions.padding;
        var dataSet = that.model.dataSet;

        // Create an array consisting of all the values in every dataset array
        var combinedData = fluid.accumulate(dataSet, floe.chartAuthoring.lineChart.timeSeries.concatData, []);

        // Get the max date of that combined array
        var maxDate = d3.max(combinedData, function (d) {
            return new Date(d.date);
        });

        // Get the min date of that combined array
        var minDate = d3.min(combinedData, function (d) {
            return new Date(d.date);
        });

        return d3.time.scale()
            .domain([minDate, maxDate])
            .range([padding, width - padding * 2]);
    };

    floe.chartAuthoring.lineChart.timeSeries.create = function (that) {
        var colors = that.options.lineOptions.colors;

        that.createBaseSVGDrawingArea();

        that.colorScale = (typeof(colors) === "function") ? colors : floe.d3.getColorScale(colors);

        that.events.onDraw.fire();

        that.events.onChartCreated.fire();

    };

})(jQuery, fluid);
