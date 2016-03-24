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

    // Mixin grade for time-series area

    fluid.defaults("floe.chartAuthoring.lineChart.timeSeries.area", {
        model: {
            dataSet: []
        },
        selectors: {
            chartLineArea: ".floec-ca-lineChart-chartLineArea"
        },
        events: {
            onChartCreated: null,  // Fire when the line is created. Ready to register D3 DOM event listeners,
            onDraw: null
        },
        listeners: {
            "onDraw.drawArea": {
                func: "{that}.drawArea",
                priority: "after:drawChartLine"
            }
        },
        invokers: {
            drawArea: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.area.drawArea",
                args: ["{that}"]
            }
        }
    });

    floe.chartAuthoring.lineChart.timeSeries.area.drawArea = function (that) {
        var chartLineAreaClass = that.classes.chartLineArea;

        var svg = that.svg,
            dataSet = that.model.dataSet;

        // Bind data and keep a reference to the bound elements
        that.chartLineAreaPaths = svg.selectAll("path." + chartLineAreaClass)
            .data(dataSet, function (d) {
                return d.id;
            });

        floe.chartAuthoring.lineChart.timeSeries.area.addArea(that);

        floe.chartAuthoring.lineChart.timeSeries.area.removeArea(that);

        floe.chartAuthoring.lineChart.timeSeries.area.updateArea(that);

    };

    floe.chartAuthoring.lineChart.timeSeries.area.addArea = function (that) {
        var chartLineAreaClass = that.classes.chartLineArea,
            color = that.colorScale,
            area = floe.chartAuthoring.lineChart.timeSeries.area.getAreaGenerator(that);
        // Append any needed area paths

        that.chartLineAreaPaths.enter()
            .append("path")
            .attr({
                "class": chartLineAreaClass,
                "fill": function (d, idx) {
                    return color(idx);
                },
                "opacity": "0.2",
                "d": function (d) {
                    return area(d.data);
                }
            });

        that.chartLineAreaPaths.each(function (d) {
            that.trackD3BoundElement(d.id, this);
        });
    };

    floe.chartAuthoring.lineChart.timeSeries.area.updateArea = function (that) {
        // Transition lines where needed
        var transitionLength = that.options.lineOptions.transitionLength,
            area = floe.chartAuthoring.lineChart.timeSeries.area.getAreaGenerator(that);

        that.chartLineAreaPaths.transition().duration(transitionLength)
            .attr({
                "d": function (d) {
                    return area(d.data);
                }
            });
    };

    floe.chartAuthoring.lineChart.timeSeries.area.removeArea = function (that) {
        // Remove areas for any removed data
        var removedPaths = that.chartLineAreaPaths.exit();
        that.exitD3Elements(removedPaths);
    };

    floe.chartAuthoring.lineChart.timeSeries.area.getAreaGenerator = function (that) {
        var interpolation = that.options.lineOptions.interpolation;
        var height = that.options.svgOptions.height,
            padding = that.options.lineOptions.padding,
            yScale = that.getYScale(),
            xScale = that.getXScale();

        var area = d3.svg.area()
            .interpolate(interpolation)
            .x(function (d) {
                return xScale(new Date(d.date));
            })
            .y0(height - padding)
            .y1(function (d) {
                return yScale(d.value);
            });

        return area;
    };

})(jQuery, fluid);
