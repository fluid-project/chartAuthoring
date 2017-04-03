/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* global fluid, floe, d3 */

(function ($, fluid) {

    "use strict";

    // Mixin grade for time-series line

    fluid.defaults("floe.chartAuthoring.lineChart.timeSeries.line", {
        model: {
            dataSet: []
        },
        lineOptions: {
            interpolation: "linear"
        },
        selectors: {
            chartLine: ".floec-ca-lineChart-chartLine"
        },
        styles: {
            chartLine: "floe-ca-lineChart-chartLine"
        },
        events: {
            "onDrawChartLine": null
        },
        listeners: {
            "onDraw.drawChartLine": {
                func: "{that}.drawChartLine"
            },
            "onDrawChartLine.updateChartLine": {
                func: "{that}.updateChartLine"
            },
            "onDrawChartLine.addChartLine": {
                func: "{that}.addChartLine",
                priority: "after:updateChartLine"
            },
            "onDrawChartLine.removeChartLine": {
                func: "{that}.removeChartLine",
                priority: "after:addChartLine"
            }
        },
        modelListeners: {
            dataSet: [{
                funcName: "{that}.events.onDraw.fire",
                excludeSource: "init"
            }]
        },
        invokers: {
            drawChartLine: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.line.drawChartLine",
                args: ["{that}"]
            },
            updateChartLine: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.line.updateChartLine",
                args: ["{that}"]
            },
            addChartLine: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.line.addChartLine",
                args: ["{that}"]
            },
            removeChartLine: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.line.removeChartLine",
                args: ["{that}"]
            },
            transitionChartLine: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.line.updateChartLine.paginateTransition"
            }
        }
    });

    floe.chartAuthoring.lineChart.timeSeries.line.drawChartLine = function (that) {
        var dataSet = that.model.dataSet,
            chartLineSelector = that.options.selectors.chartLine,
            svg = that.svg;

        // Bind data and keep a reference to the bound elements
        that.chartLinePaths = svg.selectAll("path" + chartLineSelector)
            .data(dataSet, function (d) {
                return d.id;
            });

        that.events.onDrawChartLine.fire();
    };

    floe.chartAuthoring.lineChart.timeSeries.line.addChartLine = function (that) {
        var color = that.colorScale,
            chartLineClass = that.classes.chartLine,
            line = floe.chartAuthoring.lineChart.timeSeries.line.getLineGenerator(that);

        // Append lines where needed
        that.chartLinePaths.enter()
            .append("path")
            .attr({
                "class": chartLineClass,
                "fill": "none",
                "stroke": function (d, idx) {
                    return color(idx);

                },
                "d": function (d) {
                    return line(d.data);
                }

            });

        // Track D3 bound elements in the component model

        that.chartLinePaths.each(function (d) {
            that.trackD3BoundElement(d.id, this);
        });
    };

    floe.chartAuthoring.lineChart.timeSeries.line.updateChartLine = function (that) {

        var line = floe.chartAuthoring.lineChart.timeSeries.line.getLineGenerator(that),
            transitionLength = that.options.lineOptions.transitionLength,
            width = that.options.svgOptions.width;

        that.transitionChartLine(that.chartLinePaths, line, width, transitionLength);
    };


    // Transitions a chart line in a left-sliding "page browse" style
    floe.chartAuthoring.lineChart.timeSeries.line.updateChartLine.paginateTransition = function (chartLinePaths, line, width, transitionLength) {
        chartLinePaths
        .transition()
        .duration(transitionLength / 2)
        .attr({
            "transform": "translate(-" + width + ")"
        })
        .each("end", function () {
            d3.select(this)
            .attr({
                "d": function (d) {
                    return line(d.data);
                },
                "transform": "translate(" + width + ")"
            })
            .transition()
            .attr({
                "transform": "translate(0)"
            });
        });
    };

    // Uses D3's default transition; this results in the
    // "wriggle" described at https://bost.ocks.org/mike/path/
    floe.chartAuthoring.lineChart.timeSeries.line.updateChartLine.defaultTransition = function (chartLinePaths, line, width, transitionLength) {
        chartLinePaths
        .each(function () {
            d3.select(this)
            .transition()
            .duration(transitionLength)
            .attr({
                "d": function (d) {
                    return line(d.data);
                }
            });
        });
    };

    floe.chartAuthoring.lineChart.timeSeries.line.removeChartLine = function (that) {
        // Remove any removed lines
        var removedPaths = that.chartLinePaths.exit();
        that.exitD3Elements(removedPaths);
    };

    floe.chartAuthoring.lineChart.timeSeries.line.getLineGenerator = function (that) {
        var interpolation = that.options.lineOptions.interpolation,
            yScale = that.getYScale(),
            xScale = that.getXScale();

        var line = d3.svg.line()
            .interpolate(interpolation)
            .x(function (d) {
                return xScale(new Date(d.date));
            })
            .y(function (d) {
                return yScale(d.value);
            });

        return line;
    };

})(jQuery, fluid);
