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

    // Draws simple time series line charts

    fluid.defaults("floe.chartAuthoring.lineChart.timeSeries", {
        gradeNames: ["floe.chartAuthoring.xAxisTimeSeries", "floe.chartAuthoring.yAxis",  "floe.chartAuthoring.lineChart.timeSeries.line", "floe.chartAuthoring.valueBinding", "floe.svgDrawingArea"],
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
            // Whether or not to add an area fill under the chart line
            drawArea: false,
            // Whether or not to add a point to each datapoint forming the line
            drawPoints: false,
            pointRadius: 2,
            // In milliseconds
            transitionLength: 2000
        },
        styles: {
            svg: "floe-ca-lineChart-chart",
            chartLinePoint: "floe-ca-lineChart-chartLinePoint"
        },
        selectors: {
            title: ".floec-ca-lineChart-title",
            description: ".floec-ca-lineChart-description",
            svg: ".floec-ca-lineChart-line",
            chartLinePointGroup: ".floec-ca-lineChart-chartLinePointGroup",
            chartLinePoint: ".floec-ca-lineChart-chartLinePoint",
            chartLineArea: ".floec-ca-lineChart-chartLineArea"
        },
        events: {
            onChartCreated: null,  // Fire when the line is created. Ready to register D3 DOM event listeners,
            onDraw: null
        },
        listeners: {
            "onCreate.create": {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.create",
                args: ["{that}"]
            },
            "onDraw.drawArea": {
                func: "{that}.drawArea",
                priority: "after:drawChartLine"
            },
            "onDraw.drawPoints": {
                func: "{that}.drawPoints",
                priority: "after:drawArea"
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
            target: "{that}.model.wrappedDataSet",
            singleTransform: {
                type: "fluid.transforms.free",
                args: ["{that}.model.dataSet"],
                func: "floe.chartAuthoring.lineChart.timeSeries.wrapSingleDataSet"
            }
        },
        invokers: {
            drawArea: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.drawArea",
                args: ["{that}"]
            },
            drawPoints: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.drawPoints",
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

    floe.chartAuthoring.lineChart.timeSeries.drawArea = function (that) {
        if (!that.options.lineOptions.drawArea) {
            return;
        }

        var chartLineAreaClass = that.classes.chartLineArea;

        var svg = that.svg,
            dataSet = that.model.wrappedDataSet;

        // Bind data and keep a reference to the bound elements
        that.chartLineAreaPaths = svg.selectAll("path." + chartLineAreaClass)
            .data(dataSet, function (d) {
                return d.id;
            });

        floe.chartAuthoring.lineChart.timeSeries.addArea(that);

        floe.chartAuthoring.lineChart.timeSeries.removeArea(that);

        floe.chartAuthoring.lineChart.timeSeries.updateArea(that);

    };

    floe.chartAuthoring.lineChart.timeSeries.addArea = function (that) {
        var chartLineAreaClass = that.classes.chartLineArea,
            color = that.colorScale,
            area = floe.chartAuthoring.lineChart.timeSeries.getAreaGenerator(that);
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

    floe.chartAuthoring.lineChart.timeSeries.updateArea = function (that) {
        // Transition lines where needed
        var transitionLength = that.options.lineOptions.transitionLength,
            area = floe.chartAuthoring.lineChart.timeSeries.getAreaGenerator(that);

        that.chartLineAreaPaths.transition().duration(transitionLength)
            .attr({
                "d": function (d) {
                    return area(d.data);
                }
            });
    };

    floe.chartAuthoring.lineChart.timeSeries.removeArea = function (that) {
        // Remove areas for any removed data
        var removedPaths = that.chartLineAreaPaths.exit();
        that.exitD3Elements(removedPaths);
    };

    floe.chartAuthoring.lineChart.timeSeries.drawPoints = function (that) {
        if (!that.options.lineOptions.drawPoints) {
            return;
        }

        var svg = that.svg,
            dataSet = that.model.wrappedDataSet,
            chartLinePointGroupClass = that.classes.chartLinePointGroup;

        // Bind data for circle groups
        that.chartLinePointGroups = svg.selectAll("g." + chartLinePointGroupClass)
        .data(dataSet, function (d) {
            return d.id;
        });

        floe.chartAuthoring.lineChart.timeSeries.addPointGroups(that);

        floe.chartAuthoring.lineChart.timeSeries.deletePointGroups(that);

        floe.chartAuthoring.lineChart.timeSeries.managePoints(that);

        floe.chartAuthoring.lineChart.timeSeries.updatePoints(that);
    };

    floe.chartAuthoring.lineChart.timeSeries.addPointGroups = function (that) {
        var chartLinePointGroupClass = that.classes.chartLinePointGroup;
        // Append any needed circle groups

        that.chartLinePointGroups.enter()
            .append("g")
            .attr("class", chartLinePointGroupClass);

        that.chartLinePointGroups.each(function (d) {
            that.trackD3BoundElement(d.id, this);
        });
    };

    floe.chartAuthoring.lineChart.timeSeries.deletePointGroups = function (that) {
        // Exit any removed circle groups
        var removedPointGroups = that.chartLinePointGroups.exit();
        that.exitD3Elements(removedPointGroups);
    };

    floe.chartAuthoring.lineChart.timeSeries.managePoints = function (that) {
        var chartLinePointClass = that.classes.chartLinePoint,
            pointRadius = that.options.lineOptions.pointRadius,
            color = that.colorScale,
            yScale = floe.chartAuthoring.lineChart.timeSeries.getYScale(that),
            xScale = floe.chartAuthoring.lineChart.timeSeries.getXScale(that);
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

    floe.chartAuthoring.lineChart.timeSeries.updatePoints = function (that) {
        var transitionLength = that.options.lineOptions.transitionLength,
            yScale = floe.chartAuthoring.lineChart.timeSeries.getYScale(that),
            xScale = floe.chartAuthoring.lineChart.timeSeries.getXScale(that);
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

    // Accumulator function for consolidating multiple dataset items together
    // for purposes of determining max/min
    floe.chartAuthoring.lineChart.timeSeries.concatData = function (setItem, accumulationArray) {
        return accumulationArray.concat(setItem.data);
    };

    floe.chartAuthoring.lineChart.timeSeries.getYScale = function (that) {
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

    floe.chartAuthoring.lineChart.timeSeries.getXScale = function (that) {
        var width = that.options.svgOptions.width;
        var padding = that.options.lineOptions.padding;
        var dataSet = that.model.wrappedDataSet;

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

    floe.chartAuthoring.lineChart.timeSeries.getAreaGenerator = function (that) {
        var interpolation = that.options.lineOptions.interpolation;
        var height = that.options.svgOptions.height,
            padding = that.options.lineOptions.padding,
            yScale = floe.chartAuthoring.lineChart.timeSeries.getYScale(that),
            xScale = floe.chartAuthoring.lineChart.timeSeries.getXScale(that);

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

    floe.chartAuthoring.lineChart.timeSeries.create = function (that) {
        var colors = that.options.lineOptions.colors;

        that.createBaseSVGDrawingArea();

        that.colorScale = (typeof(colors) === "function") ? colors : floe.d3.getColorScale(colors);

        that.events.onDraw.fire();

        that.events.onChartCreated.fire();

    };

})(jQuery, fluid);
