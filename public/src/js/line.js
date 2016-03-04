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

    fluid.defaults("floe.chartAuthoring.lineChart.chart", {
        gradeNames: ["floe.chartAuthoring.valueBinding", "floe.d3ViewComponent"],
        model: {
            dataSet: [],
            // a dataset for this chart type should look like this:
            // [
            //  {
            //     "date": "2014-12-31",
            //     "value": 45
            //  },
            //  {
            //     "date": "2015-01-07",
            //     "value": 24
            //  }
            // ]
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
            // interpolation mode for chart line
            // see line.interpolate at https://github.com/mbostock/d3/wiki/SVG-Shapes
            // generally, "linear" for sharp lines, "basis" for smooth
            interpolation: "linear",
            // Whether or not to add an area fill under the chart line
            addArea: false,
            // Whether or not to add a point to each datapoint forming the line
            // Should not be used when using basis interpolation
            addPoints: false,
            pointRadius: 2
        },
        styles: {
            svg: "floe-ca-lineChart-chart",
            chartLinePoint: "floe-ca-lineChart-chartLinePoint"
        },
        selectors: {
            title: ".floec-ca-lineChart-title",
            description: ".floec-ca-lineChart-description",
            svg: ".floec-ca-lineChart-line",
            yAxis: ".floec-ca-lineChart-y-axis",
            xAxis: ".floec-ca-lineChart-x-axis",
            chartLine: ".floec-ca-lineChart-chartLine",
            chartLinePointGroup: ".floec-ca-lineChart-chartLinePointGroup",
            chartLinePoint: ".floec-ca-lineChart-chartLinePoint",
            chartLineArea: ".floec-ca-lineChart-chartLineArea"
        },
        events: {
            onChartCreated: null,  // Fire when the line is created. Ready to register D3 DOM event listeners,
            onChartRedrawn: null // Fire when the chart is redrawn.
        },
        listeners: {
            "onCreate.create": {
                funcName: "floe.chartAuthoring.lineChart.chart.create",
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
                funcName: "floe.chartAuthoring.lineChart.chart.draw",
                args: ["{that}"]
            }
        }
    });

    // Test if a dataset is multi
    floe.chartAuthoring.lineChart.chart.isMultiDataSet = function (dataSet) {
        if (dataSet[0].id !== undefined && dataSet[0].data !== undefined) {
            return true;
        } else {
            return false;
        }
    };

    // Wrap a non-multi dataset so we can process it with the same functions
    floe.chartAuthoring.lineChart.chart.wrapSingleDataSet = function (dataSet) {
        var wrapped = [
            {id: "dataSet",
            data: dataSet }
        ];
        return wrapped;
    };

    floe.chartAuthoring.lineChart.chart.draw = function (that) {
        // console.log("floe.chartAuthoring.lineChart.chart.draw");

        var shouldAddArea = that.options.lineOptions.addArea,
            shouldAddPoints = that.options.lineOptions.addPoints,
            dataSet = that.model.dataSet;

        // Remove any older drawn elements from a previous dataset
        that.locate("xAxis").remove();
        that.locate("yAxis").remove();
        that.locate("chartLine").remove();
        that.locate("chartLinePoint").remove();

        var isMultiDataSet = floe.chartAuthoring.lineChart.chart.isMultiDataSet(dataSet);

        if (!isMultiDataSet) {
            that.wrappedDataSet = floe.chartAuthoring.lineChart.chart.wrapSingleDataSet(dataSet);
        } else {
            that.wrappedDataSet = dataSet;
        }

        that.yScale = floe.chartAuthoring.lineChart.chart.getYScale(that);

        that.xScale = floe.chartAuthoring.lineChart.chart.getXScale(that);

        that.yAxis = floe.chartAuthoring.lineChart.chart.getYAxis(that);

        that.xAxis = floe.chartAuthoring.lineChart.chart.getXAxis(that);

        that.line = floe.chartAuthoring.lineChart.chart.getLineGenerator(that);

        that.area = floe.chartAuthoring.lineChart.chart.getAreaGenerator(that);

        floe.chartAuthoring.lineChart.chart.addYAxis(that);

        floe.chartAuthoring.lineChart.chart.addXAxis(that);

        floe.chartAuthoring.lineChart.chart.addChartLine(that);

        if (shouldAddArea) {
            floe.chartAuthoring.lineChart.chart.addArea(that);
        }

        if (shouldAddPoints) {
            floe.chartAuthoring.lineChart.chart.addPoints(that);
        }

        that.events.onChartRedrawn.fire();

    };

    floe.chartAuthoring.lineChart.chart.addYAxis = function (that) {
        var yAxisClass = that.classes.yAxis,
            padding = that.options.lineOptions.padding;
        // Append the y axis
        that.svg.append("g")
            .attr({
                "transform": "translate(" + padding + ",0)",
                "class": yAxisClass
            })
            .call(that.yAxis);
    };

    floe.chartAuthoring.lineChart.chart.addXAxis = function (that) {
        var xAxisClass = that.classes.xAxis,
            padding = that.options.lineOptions.padding,
            height = that.options.svgOptions.height;
        // Append the x axis
        that.svg.append("g")
            .attr({
                "transform": "translate(0," + (height - padding) + ")",
                "class": xAxisClass
            })
            .call(that.xAxis);
    };

    floe.chartAuthoring.lineChart.chart.addChartLine = function (that) {
        var dataSet = that.wrappedDataSet,
            chartLineClass = that.classes.chartLine,
            svg = that.svg,
            color = that.colorScale;

        // Append the line based on the dataset
        fluid.each(dataSet, function (setItem, idx) {
            svg.append("path")
                .data([setItem.data])
                .attr({
                    "class": chartLineClass,
                    "fill": "none",
                    "stroke": color(idx),
                    "d": that.line
                });
        });

    };

    floe.chartAuthoring.lineChart.chart.addArea = function (that) {
        var chartLineAreaClass = that.classes.chartLineArea,
            color = that.colorScale;
        // Append the area path for the line
        var svg = that.svg,
            dataSet = that.wrappedDataSet;

        fluid.each(dataSet, function (setItem, idx) {
            svg.append("path")
                .attr("class", chartLineAreaClass)
                .attr("fill", color(idx))
                .attr("opacity", "0.2")
                .data([setItem.data])
                .attr("d", that.area);
        });
    };

    floe.chartAuthoring.lineChart.chart.addPoints = function (that) {
        var svg = that.svg,
            dataSet = that.wrappedDataSet,
            chartLinePointGroupClass = that.classes.chartLinePointGroup,
            chartLinePointClass = that.classes.chartLinePoint,
            pointRadius = that.options.lineOptions.pointRadius,
            color = that.colorScale;

        fluid.each(dataSet, function (setItem, idx) {
            // Append a group for the datapoints
            var dataPoints = svg.append("g").attr("class", chartLinePointGroupClass);
            // Append a point for each datapoint
            dataPoints.selectAll("circle")
            .data(setItem.data)
            .enter()
            .append("circle")
            .attr("class", chartLinePointClass)
            .attr("fill", color(idx))
            .attr("r", pointRadius)
            .attr("cy", function (d) {
                return that.yScale(d.value);
            })
            .attr("cx", function (d) {
                return that.xScale(new Date(d.date));
            });
        });
    };

    floe.chartAuthoring.lineChart.chart.getYScale = function (that) {
        var height = that.options.svgOptions.height;
        var padding = that.options.lineOptions.padding;
        var dataSet = that.wrappedDataSet;

        var maxValues = [];

        fluid.each(dataSet, function (setItem) {
            var maxValue = d3.max(setItem.data, function (d) {
                return d.value;
            });
            maxValues.push(maxValue);
        });

        var dataSetMax = d3.max(maxValues, function (d) {
            return d;
        });

        return d3.scale.linear()
            .domain([0, dataSetMax])
            .nice()
            .range([height - padding, padding]);
    };

    floe.chartAuthoring.lineChart.chart.getXScale = function (that) {
        var width = that.options.svgOptions.width;
        var padding = that.options.lineOptions.padding;
        var dataSet = that.wrappedDataSet;

        var minDates = [];
        var maxDates = [];

        fluid.each(dataSet, function (setItem) {
            var minDate = d3.min(setItem.data, function (d) {
                return new Date(d.date);
            });
            minDates.push(minDate);

            var maxDate = d3.max(setItem.data, function (d) {
                return new Date(d.date);
            });
            maxDates.push(maxDate);

        });

        var minDate = d3.min(minDates, function (d) {
            return new Date(d);
        });

        var maxDate = d3.max(maxDates, function (d) {
            return new Date(d);
        });

        return d3.time.scale()
            .domain([minDate, maxDate])
            .range([padding, width - padding * 2]);
    };

    floe.chartAuthoring.lineChart.chart.getYAxis = function (that) {
        var width = that.options.svgOptions.width;
        var padding = that.options.lineOptions.padding;
        var yScale = that.yScale;

        var yAxis = d3.svg.axis()
            .orient("left")
            .scale(yScale)
            .innerTickSize(- width + padding * 3)
            .outerTickSize(0)
            .tickPadding(10);

        return yAxis;
    };

    floe.chartAuthoring.lineChart.chart.getXAxis = function (that) {
        var xScale = that.xScale;

        var customTickFormat = d3.time.format.multi([
            [".%L", function (d) { return d.getMilliseconds(); }],
            [":%S", function (d) { return d.getSeconds(); }],
            ["%I:%M", function (d) { return d.getMinutes(); }],
            ["%I %p", function (d) { return d.getHours(); }],
            ["%a %d", function (d) { return d.getDay() && d.getDate() !== 1; }],
            ["%b %d", function (d) { return d.getDate() !== 1; }],
            ["%b", function (d) { return d.getMonth(); }],
            ["%Y", function () { return true; }]
        ]);

        var xAxis = d3.svg.axis()
            .tickFormat(customTickFormat)
            .orient("bottom")
            .scale(xScale);

        return xAxis;

    };

    floe.chartAuthoring.lineChart.chart.getLineGenerator = function (that) {
        var interpolation = that.options.lineOptions.interpolation;

        var line = d3.svg.line()
            .interpolate(interpolation)
            .x(function (d) {
                return that.xScale(new Date(d.date));
            })
            .y(function (d) {
                return that.yScale(d.value);
            });

        return line;
    };

    floe.chartAuthoring.lineChart.chart.getAreaGenerator = function (that) {
        var interpolation = that.options.lineOptions.interpolation;
        var height = that.options.svgOptions.height,
            padding = that.options.lineOptions.padding;

        var area = d3.svg.area()
            .interpolate(interpolation)
            .x(function (d) {
                return that.xScale(new Date(d.date));
            })
            .y0(height - padding)
            .y1(function (d) {
                return that.yScale(d.value);
            });

        return area;
    };

    floe.chartAuthoring.lineChart.chart.create = function (that) {
        var colors = that.options.lineOptions.colors;

        that.createBaseSVGDrawingArea();

        that.colorScale = (typeof(colors) === "function") ? colors : floe.d3.getColorScale(colors);

        that.draw();

        that.events.onChartCreated.fire();

    };

})(jQuery, fluid);
