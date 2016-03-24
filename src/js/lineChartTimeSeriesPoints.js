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

    // Mixin grade for line chart points

    fluid.defaults("floe.chartAuthoring.lineChart.timeSeries.points", {
        model: {
            dataSet: []
        },
        lineOptions: {
            pointRadius: 2
        },
        styles: {
            chartLinePoint: "floe-ca-lineChart-chartLinePoint"
        },
        selectors: {
            chartLinePointGroup: ".floec-ca-lineChart-chartLinePointGroup",
            chartLinePoint: ".floec-ca-lineChart-chartLinePoint"
        },
        listeners: {
            "onDraw.drawPoints": {
                func: "{that}.drawPoints",
                priority: "after:drawArea"
            }
        },
        invokers: {
            drawPoints: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.points.drawPoints",
                args: ["{that}"]
            }
        }
    });

    floe.chartAuthoring.lineChart.timeSeries.points.drawPoints = function (that) {
        var svg = that.svg,
            dataSet = that.model.dataSet,
            chartLinePointGroupClass = that.classes.chartLinePointGroup;

        // Bind data for circle groups
        that.chartLinePointGroups = svg.selectAll("g." + chartLinePointGroupClass)
        .data(dataSet, function (d) {
            return d.id;
        });

        floe.chartAuthoring.lineChart.timeSeries.points.addPointGroups(that);

        floe.chartAuthoring.lineChart.timeSeries.points.deletePointGroups(that);

        floe.chartAuthoring.lineChart.timeSeries.points.managePoints(that);

        floe.chartAuthoring.lineChart.timeSeries.points.updatePoints(that);
    };

    floe.chartAuthoring.lineChart.timeSeries.points.addPointGroups = function (that) {
        var chartLinePointGroupClass = that.classes.chartLinePointGroup;
        // Append any needed circle groups

        that.chartLinePointGroups.enter()
            .append("g")
            .attr("class", chartLinePointGroupClass);

        that.chartLinePointGroups.each(function (d) {
            that.trackD3BoundElement(d.id, this);
        });
    };

    floe.chartAuthoring.lineChart.timeSeries.points.deletePointGroups = function (that) {
        // Exit any removed circle groups
        var removedPointGroups = that.chartLinePointGroups.exit();
        that.exitD3Elements(removedPointGroups);
    };

    floe.chartAuthoring.lineChart.timeSeries.points.managePoints = function (that) {
        var chartLinePointClass = that.classes.chartLinePoint,
            pointRadius = that.options.lineOptions.pointRadius,
            color = that.colorScale,
            yScale = that.getYScale(),
            xScale = that.getXScale();
        // Append needed circles for each group
        that.chartLinePointGroups.each(function (d, idx) {
            var currentGroup = d3.select(this);

            var circles = currentGroup.selectAll("circle")
                    .data(d.data, function (currentData, index) {
                    return d.id + "-" + index;
                });

            // Create new circles
            circles.enter()
            .append("circle")
            .attr({
                "class": chartLinePointClass,
                "fill": color(idx),
                "r": pointRadius,
                "cy": function (d) {
                    return yScale(d.value);
                },
                "cx": function (d) {
                    return xScale(new Date(d.date));
                }
            })
            .each(function (currentData, index) {
                that.trackD3BoundElement(d.id + "-" + index, this);
            });

            // Remove exited circles
            var removedCircles = circles.exit();
            that.exitD3Elements(removedCircles);
        });
    };

    floe.chartAuthoring.lineChart.timeSeries.points.updatePoints = function (that) {
        var transitionLength = that.options.lineOptions.transitionLength,
            yScale = that.getYScale(),
            xScale = that.getXScale();
            // Transition circles
        that.chartLinePointGroups.each(function () {
            var currentGroup = d3.select(this);

            currentGroup.selectAll("circle")
                .transition().duration(transitionLength)
                .attr({
                    "cy": function (d) {
                        return yScale(d.value);
                    },
                    "cx": function (d) {
                        return xScale(new Date(d.date));
                    }
                });
        });
    };
})(jQuery, fluid);
