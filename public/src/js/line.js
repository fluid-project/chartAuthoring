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

    fluid.defaults("floe.chartAuthoring.lineChart.line", {
        gradeNames: ["floe.chartAuthoring.valueBinding", "floe.chartAuthoring.totalRelaying", "floe.d3ViewComponent"],
        model: {
            dataSet: [],
            lineTitle: "Line Chart",
            lineDescription: "A line chart."
        },
        bindings: {
            title: "lineTitle",
            description: "lineDescription"
        },
        lineOptions: {
            width: 500,
            height: 500,
            padding: 25
        },
        styles: {
            line: "floe-ca-lineChart-line"
        },
        selectors: {
            title: ".floec-ca-lineChart-title",
            description: ".floec-ca-lineChart-description"
        },
        events: {
            onLineCreated: null,  // Fire when the line is created. Ready to register D3 DOM event listeners,
            onLineRedrawn: null // Fire when the line is redrawn.
        },
        listeners: {
            "onCreate.create": {
                funcName: "floe.chartAuthoring.lineChart.line.create",
                args: ["{that}"]
            }
        },
        modelListeners: {
            dataSet: {
                funcName: "{that}.draw",
                excludeSource: "init"
            }
        },
        invokers: {
            draw: {
                funcName: "floe.chartAuthoring.lineChart.line.draw",
                args: ["{that}"]
            }
        }
    });

    floe.chartAuthoring.lineChart.line.addDataPoints = function (that) {

    };

    floe.chartAuthoring.lineChart.line.updateDataPoints = function (that) {

    };

    floe.chartAuthoring.lineChart.line.removeDataPoints = function (that) {

    };

    floe.chartAuthoring.lineChart.line.draw = function (that) {
        console.log("floe.chartAuthoring.lineChart.line.draw");

        var svg = that.svg;
        var height = that.options.lineOptions.height;
        var padding = that.options.lineOptions.padding;
        var dataSet = that.model.dataSet;

        that.yScale = floe.chartAuthoring.lineChart.line.getYScale(that);

        that.xScale = floe.chartAuthoring.lineChart.line.getXScale(that);

        that.yAxis = floe.chartAuthoring.lineChart.line.getYAxis(that);

        that.xAxis = floe.chartAuthoring.lineChart.line.getXAxis(that);

        that.line = floe.chartAuthoring.lineChart.line.getLineFunction(that);

        console.log(svg);

        svg.append("g")
            .attr("transform", "translate("+padding+",0)")
            .call(that.yAxis);

        svg.append("g")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(that.xAxis);

        var line = d3.svg.line()
            // .interpolate("basis")
            .x(function(d){
                return that.xScale(new Date(d.date));
            })
            .y(function(d) {
                return that.yScale(d.value);
            });

        svg.append("path")
            .datum(dataSet)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", "1.5px")
            .attr("d", that.line);

    };

    floe.chartAuthoring.lineChart.line.getYScale = function(that) {
        var height = that.options.lineOptions.height;
        var padding = that.options.lineOptions.padding;
        var dataSet = that.model.dataSet;

        var dataSetMin = d3.min(dataSet, function(d) {
            return d.value;
        });

        var dataSetMax = d3.max(dataSet, function(d) {
            return d.value;
        });

        return d3.scale.linear()
            .domain([dataSetMin, dataSetMax])
            .range([height - padding, padding])
    };

    floe.chartAuthoring.lineChart.line.getXScale = function(that) {
        var width = that.options.lineOptions.width;
        var padding = that.options.lineOptions.padding;
        var dataSet = that.model.dataSet;
        var minDate = new Date(dataSet[0].date);
        var maxDate = new Date(dataSet[dataSet.length -1].date);

        return d3.time.scale()
            .domain([minDate, maxDate])
            .range([padding, width - padding * 2]);
    };

    floe.chartAuthoring.lineChart.line.getYAxis = function(that) {
        var width = that.options.lineOptions.width;
        var padding = that.options.lineOptions.padding;
        var yScale = that.yScale;

        var yAxis = d3.svg.axis()
            .orient("left")
            .scale(yScale)
            .innerTickSize(-width+padding*3)
            .outerTickSize(0)
            .tickPadding(10);

        return yAxis;
    };

    floe.chartAuthoring.lineChart.line.getXAxis = function(that) {
        var height = that.options.lineOptions.height;
        var padding = that.options.lineOptions.padding;
        var xScale = that.xScale;

        var customTickFormat = d3.time.format.multi([
          [".%L", function(d) { return d.getMilliseconds(); }],
          [":%S", function(d) { return d.getSeconds(); }],
          ["%I:%M", function(d) { return d.getMinutes(); }],
          ["%I %p", function(d) { return d.getHours(); }],
          ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
          ["%b %d", function(d) { return d.getDate() != 1; }],
          ["%b", function(d) { return d.getMonth(); }],
          ["%Y", function() { return true; }]
        ]);

        var xAxis = d3.svg.axis()
            .tickFormat(customTickFormat)
            .orient("bottom")
            .scale(xScale);

        return xAxis;

    };

    floe.chartAuthoring.lineChart.line.getLineFunction = function(that) {
        var line = d3.svg.line()
            // .interpolate("basis")
            .x(function(d){
                return that.xScale(new Date(d.date));
            })
            .y(function(d) {
                return that.yScale(d.value);
            });

        return line;
    };

    floe.chartAuthoring.lineChart.line.create = function (that) {
        console.log("floe.chartAuthoring.lineChart.line.create");

        var container = that.container,
            width = that.options.lineOptions.width,
            height = that.options.lineOptions.height,
            lineClass = that.classes.line;

        that.svg = that.jQueryToD3(container)
            .append("svg")
            .attr({
                "width": width,
                "height": height,
                "class": lineClass,
                // "viewBox": floe.chartAuthoring.pieChart.getViewBoxConfiguration(0, 0, width, height),
                // Set aria role to image - this causes the pie to appear as a
                // static image to AT rather than as a number of separate
                // images
                "role": "img"
            });

        that.draw();

        that.events.onLineCreated.fire();

    };

})(jQuery, fluid);
