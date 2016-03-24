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
        listeners: {
            "onDraw.drawChartLine": {
                func: "{that}.drawChartLine"
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
            }
        }
    });

    floe.chartAuthoring.lineChart.timeSeries.line.drawChartLine = function (that) {
        var dataSet = that.model.dataSet,
            chartLineClass = that.classes.chartLine,
            svg = that.svg;

        // Bind data and keep a reference to the bound elements
        that.chartLinePaths = svg.selectAll("path." + chartLineClass)
            .data(dataSet, function (d) {
                return d.id;
            });

        floe.chartAuthoring.lineChart.timeSeries.line.addChartLine(that);

        floe.chartAuthoring.lineChart.timeSeries.line.removeChartLine(that);

        floe.chartAuthoring.lineChart.timeSeries.line.updateChartLine(that);
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
            transitionLength = that.options.lineOptions.transitionLength;

        that.chartLinePaths.transition().duration(transitionLength)
            .attr({
                "d": function (d) {
                    return line(d.data);
                }
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
