/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("floe.chartAuthoring.pieChart.legend", {
        gradeNames: ["floe.d3ViewComponent", "autoInit"],
        strings: {
            legendColHeading:"Legend",
            labelColHeading:"Label",
            valueColHeading:"Value" //,
            // legendTitle:"" // title for the legend - translates to table caption
        },
        model: {
            // dataSet accepts:
            // 1. an array of objects. Must contain "id", "value" and "label" variables.
            // Example: [{id: string, value: number, label: string} ... ]
            dataSet: []
        },
        legendOptions: {
            // An array of colors to fill slices generated for corresponding values of model.dataSet
            // Or, a d3 color scale that's generated based off an array of colors
            colors: null,
            sort: true, // Whether or not to sort the data by values when creating the legend
            showLegendHeadings: true // Whether or not to display column headings in the legend
        },
        styles: {
            legend: "floe-ca-pieChart-legend",
            table: "floe-ca-pieChart-legend-table",
            row: "floe-ca-pieChart-legend-table-row",
            colorCell: "floe-ca-pieChart-legend-color-cell",
            labelCell: "floe-ca-pieChart-legend-label-cell",
            valueCell: "floe-ca-pieChart-legend-value-cell"
        },
        selectors: {
            legend: ".floec-ca-pieChart-legend",
            table: ".floec-ca-pieChart-legend-table",
            row: ".floec-ca-pieChart-legend-table-row",
            caption: ".floec-ca-pieChart-legend-caption",
            colorCell: ".floec-ca-pieChart-legend-color-cell",
            labelCell: ".floec-ca-pieChart-legend-label-cell",
            valueCell: ".floec-ca-pieChart-legend-value-cell"
        },
        events: {
            onLegendCreated: null,  // Fire when the legend is created. Ready to register D3 DOM event listeners,
            onLegendRedrawn: null // Fire when the legend is redrawn.
        },
        listeners: {
            "onCreate.create": {
                funcName: "floe.chartAuthoring.pieChart.legend.create",
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
                funcName: "floe.chartAuthoring.pieChart.legend.draw",
                args: ["{that}"]
            },
            sort: {
                funcName: "floe.chartAuthoring.pieChart.legend.sort",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            getColorCellStyle: {
                funcName: "floe.chartAuthoring.pieChart.legend.getColorCellStyle",
                args: ["{arguments}.0"]
            }
        }
    });

    // Add new rows for new data, apply appropriate classes for selectors and styling

    floe.chartAuthoring.pieChart.legend.addRows = function(that) {
        var rowClass = that.classes.row,
            colorCellClass = that.classes.colorCell,
            labelCellClass = that.classes.labelCell,
            valueCellClass = that.classes.valueCell;

        var addedRows = that.rows.enter()
                            .append("tr");

        addedRows.attr({
            "class": rowClass
        });

        addedRows.append("td")
            .attr({
                "class": colorCellClass
            });

        addedRows.append("td")
            .attr({
                "class": labelCellClass
            });

        addedRows.append("td")
            .attr({
                "class": valueCellClass
            });
    };

    // Update cell legend colours, labels and values
    floe.chartAuthoring.pieChart.legend.updateRows = function (that) {
        var colorCellSelector = that.options.selectors.colorCell,
            labelCellSelector = that.options.selectors.labelCell,
            valueCellSelector = that.options.selectors.valueCell;

        that.rows.each(function (d) {
            d3.select(this)
                .select(colorCellSelector)
                .attr({
                    "style": that.getColorCellStyle(d)
                });

            d3.select(this)
                .select(labelCellSelector)
                .text(d.label);

            d3.select(this)
                .select(valueCellSelector)
                .text(d.value);
        });
    };

    floe.chartAuthoring.pieChart.legend.removeRows = function (that) {
        var removedRows = that.rows.exit();
        removedRows.remove();
    };

    floe.chartAuthoring.pieChart.legend.draw = function (that) {
        var table = that.table,
            legendOptions = that.options.legendOptions,
            colors = floe.chartAuthoring.pieChart.legend.getColorArray(legendOptions.colors),
            sort = legendOptions.sort;

        // Consolidate user-supplied colors with dataset at draw time

        var dataSet = floe.chartAuthoring.pieChart.legend.addValueFromArray(that.model.dataSet, colors, "color");

        var tbody = table.selectAll("tbody");

        that.rows = tbody.selectAll("tr")
                            .data(dataSet, function (d) {
                                return d.id;
                            });

        floe.chartAuthoring.pieChart.legend.addRows(that);

        floe.chartAuthoring.pieChart.legend.updateRows(that);

        floe.chartAuthoring.pieChart.legend.removeRows(that);

        if (sort) {
            that.rows.sort(that.sort);
        }

        that.events.onLegendRedrawn.fire();
    };

    floe.chartAuthoring.pieChart.legend.create = function (that) {
        var container = that.container,
            tableClass = that.classes.table,
            showLegendHeadings = that.options.legendOptions.showLegendHeadings;

        that.table = that.jQueryToD3(container)
            .append("table")
            .attr({
                "class": tableClass,
                "aria-live": "polite",
                "aria-relevant": "all"
            });

        if(that.options.strings.legendTitle !== null) {
            that.table.append("caption")
            .attr({
                "class": that.classes.caption
            })
            .text(that.options.strings.legendTitle);
        }

        that.table.append("thead");
        that.table.append("tbody");
        if(showLegendHeadings) {
            var thead = that.table.selectAll("thead");

            thead.append("th")
                .attr({
                    "scope":"col"
                })
                .html(that.options.strings.legendColHeading);

            thead.append("th")
                .attr({
                    "scope":"col"
                })
                .html(that.options.strings.labelColHeading);

            thead.append("th")
                .attr({
                    "scope":"col"
                })
                .html(that.options.strings.valueColHeading);
        }

        that.draw();

        that.events.onLegendCreated.fire();
    };

    floe.chartAuthoring.pieChart.legend.sort = function (a, b) {
        return b.value - a.value;
    };

    floe.chartAuthoring.pieChart.legend.getColorCellStyle = function (data) {
        return "background-color: " + data.color + ";";
    };

    // Given an array of objects, an array of values and new value name, loop
    // the object array in index order, apply the value from the array at the
    // same index to the value name, and return a new object array with the
    // added values

    floe.chartAuthoring.pieChart.legend.addValueFromArray = function (objectArray, valueArray, newValueName) {
        // Don't do anything if not passed an actual array in the value array
        if(fluid.isArrayable(valueArray)) {
            return fluid.transform(objectArray, function (object, idx) {
                var consolidated = fluid.copy(object);
                consolidated[newValueName] = valueArray[idx];

                return consolidated;
            });
        } else {
            return objectArray;
        }
    };

    // Scales the supplied colors using d3 and returns them as an array

    floe.chartAuthoring.pieChart.legend.getColorArray = function (colors) {
        var colorScale = (typeof(colors) === "function") ? colors : floe.d3.getColorScale(colors);
        return colorScale.range();
    };

})(jQuery, fluid);
