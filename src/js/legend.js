/*
Copyright 2015-2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* global fluid, floe, d3 */

(function ($, fluid) {

    "use strict";

    fluid.defaults("floe.chartAuthoring.pieChart.legend", {
        gradeNames: ["floe.chartAuthoring.totalRelaying", "floe.d3ViewComponent"],
        strings: {
            legendColHeading: "Legend",
            labelColHeading: "Label",
            valueColHeading: "Value" //,
            // legendTitle:"" // title for the legend - translates to table caption
        },
        model: {
            // dataSet accepts:
            // 1. an array of objects. Must contain "id", "value" and "label" variables.
            // Example: [{id: string, value: number, label: string} ... ]
            dataSet: []
            // Supplied by relaying in floe.chartAuthoring.totalRelaying grade
            // total: {
            //     value: number,
            //     percentage: number
            // },
            // Tracks the "active" row
            // activeRowId:
        },
        legendOptions: {
            // An array of colors to fill slices generated for corresponding values of model.dataSet
            // Or, a d3 color scale that's generated based off an array of colors
            colors: null,
            sort: true, // Whether or not to sort the data by values when creating the legend
            showLegendHeadings: true, // Whether or not to display column headings in the legend,
            // A fluid.stringTemplate used to render the text displayed
            // within the label cell
            // available variables for the template are:
            // - value: the raw value of the data
            // - percentage: the percentage of the data value out of the total value
            // - total: the total value of all data in the dataset
            // - label: the attached label
            labelTextDisplayTemplate: "%label",
            // A fluid.stringTemplate used to render the text displayed
            // within the value cell
            // the same variables available as for labelTextDisplayTemplate
            valueTextDisplayTemplate: "%value",
            // Number of digits to display after decimal when rendering
            // percentages for the legend
            legendPercentageDigits: 0
        },
        styles: {
            legend: "floe-ca-pieChart-legend",
            table: "floe-ca-pieChart-legend-table",
            row: "floe-ca-pieChart-legend-table-row",
            headerRow: "floe-ca-pieChart-legend-table-header-row",
            colorHeader: "floe-ca-pieChart-legend-color-header",
            labelHeader: "floe-ca-pieChart-legend-label-header",
            valueHeader: "floe-ca-pieChart-legend-value-header",
            colorCell: "floe-ca-pieChart-legend-color-cell",
            labelCell: "floe-ca-pieChart-legend-label-cell",
            valueCell: "floe-ca-pieChart-legend-value-cell",
            highlight: "floe-ca-currently-playing"
        },
        selectors: {
            legend: ".floec-ca-pieChart-legend",
            table: ".floec-ca-pieChart-legend-table",
            row: ".floec-ca-pieChart-legend-table-row",
            headerRow: ".floec-ca-pieChart-legend-table-header-row",
            colorHeader: ".floec-ca-pieChart-legend-color-header",
            labelHeader: ".floec-ca-pieChart-legend-label-header",
            valueHeader: ".floec-ca-pieChart-legend-value-header",
            caption: ".floec-ca-pieChart-legend-caption",
            colorCell: ".floec-ca-pieChart-legend-color-cell",
            labelCell: ".floec-ca-pieChart-legend-label-cell",
            valueCell: ".floec-ca-pieChart-legend-value-cell"
        },
        events: {
            onLegendCreated: null,  // Fire when the legend is created. Ready to register D3 DOM event listeners,
            onDraw: null // Fire when the legend is redrawn.
        },
        listeners: {
            "onCreate.create": {
                funcName: "floe.chartAuthoring.pieChart.legend.create",
                args: ["{that}"]
            },
            "onDraw.addRows": {
                func: "{that}.addRows"
            },
            "onDraw.updateRows": {
                func: "{that}.updateRows",
                priority: "after:addRows"
            },
            "onDraw.removeRows": {
                func: "{that}.removeRows",
                priority: "after:updateRows"
            }
        },
        modelListeners: {
            dataSet: {
                funcName: "{that}.draw",
                excludeSource: "init"
            },
            activeRowId: {
                func: "floe.d3ViewComponent.toggleCSSClassByDataId",
                args: ["{that}.model.activeRowId", "{that}.options.styles.highlight", "{that}"]
            }
        },
        invokers: {
            draw: {
                funcName: "floe.chartAuthoring.pieChart.legend.draw",
                args: ["{that}"]
            },
            sort: {
                funcName: "floe.chartAuthoring.utils.sortAscending",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            getColorCellStyle: {
                funcName: "floe.chartAuthoring.pieChart.legend.getColorCellStyle",
                args: ["{arguments}.0"]
            },
            addRows: {
                funcName: "floe.chartAuthoring.pieChart.legend.addRows",
                args: ["{that}"]
            },
            updateRows: {
                funcName: "floe.chartAuthoring.pieChart.legend.updateRows",
                args: ["{that}"]
            },
            removeRows: {
                funcName: "floe.chartAuthoring.pieChart.legend.removeRows",
                args: ["{that}"]
            }
        }
    });

    // Add new rows for new data, apply appropriate classes for selectors and styling

    floe.chartAuthoring.pieChart.legend.addRows = function (that) {
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
            valueCellSelector = that.options.selectors.valueCell,
            percentageDigits = that.options.legendOptions.legendPercentageDigits,
            totalValue = that.model.total.value,
            labelTextDisplayTemplate = that.options.legendOptions.labelTextDisplayTemplate,
            valueTextDisplayTemplate = that.options.legendOptions.valueTextDisplayTemplate;

        that.rows.each(function (d) {
            that.trackD3BoundElement(d.id, this);

            d3.select(this)
                .select(colorCellSelector)
                .attr({
                    "style": that.getColorCellStyle(d),
                    // presentation role for these cells, since they have no non-visual semantic meaning
                    "role": "presentation"
                });

            d3.select(this)
                .select(labelCellSelector)
                .text(function (d) {
                    return floe.d3ViewComponent.getTemplatedDisplayValue(totalValue, percentageDigits, labelTextDisplayTemplate, d);
                });

            d3.select(this)
                .select(valueCellSelector)
                .text(function (d) {
                    return floe.d3ViewComponent.getTemplatedDisplayValue(totalValue, percentageDigits, valueTextDisplayTemplate, d);
                });
        });
    };

    floe.chartAuthoring.pieChart.legend.removeRows = function (that) {
        var removedRows = that.rows.exit();
        that.exitD3Elements(removedRows);
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

        that.events.onDraw.fire();

        if (sort) {
            that.rows.sort(that.sort);
        }


    };

    floe.chartAuthoring.pieChart.legend.create = function (that) {
        var container = that.container,
            tableClass = that.classes.table,
            headerRowClass = that.classes.headerRow,
            colorHeaderClass = that.classes.colorHeader,
            labelHeaderClass = that.classes.labelHeader,
            valueHeaderClass = that.classes.valueHeader,
            showLegendHeadings = that.options.legendOptions.showLegendHeadings;

        that.table = that.jQueryToD3(container)
            .append("table")
            .attr({
                "class": tableClass,
                "aria-live": "polite",
                "aria-relevant": "all"
            });

        if (that.options.strings.legendTitle !== null) {
            that.table.append("caption")
            .attr({
                "class": that.classes.caption
            })
            .text(that.options.strings.legendTitle);
        }

        that.table.append("thead");
        that.table.append("tbody");
        if (showLegendHeadings) {
            var thead = that.table.selectAll("thead");

            var theadRow = thead.append("tr");

            theadRow.attr({
                "class": headerRowClass
            });

            theadRow.append("th")
                .attr({
                    "scope": "col",
                    "class": colorHeaderClass
                })
                .html(that.options.strings.legendColHeading);

            theadRow.append("th")
                .attr({
                    "scope": "col",
                    "class": labelHeaderClass
                })
                .html(that.options.strings.labelColHeading);

            theadRow.append("th")
                .attr({
                    "scope": "col",
                    "class": valueHeaderClass
                })
                .html(that.options.strings.valueColHeading);
        }

        that.draw();

        that.events.onLegendCreated.fire();
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
        if (fluid.isArrayable(valueArray)) {
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
