/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.chartAuthoring.pieChart.legend", {
        gradeNames: ["gpii.d3ViewComponent", "autoInit"],
        strings: {
            legendColHeading:"Legend",
            labelColHeading:"Label",
            valueColHeading:"Value"
        },
        model: {
            // dataSet accepts:
            // 1. an array of objects. Must contain "id", "value" and "label" variables.
            // Example: [{id: string, value: number, label: string} ... ]
            dataSet: []
            // "dataSetWithColors" consolidates the dataset in original order with the array of colors, into a single array of objects
            // dataSetWithColors: []
        },
        legendOptions: {
            // An array of colors to fill slices generated for corresponding values of model.dataSet
            // Or, a d3 color scale that's generated based off an array of colors
            colors: null,
            sort: true, // Whether or not to sort the data by values when creating the legend
            showLegendHeadings: true // Whether or not to display column headings in the legend
        },
        modelRelay: [{
            target: "dataSetWithColors",
            singleTransform: {
                type: "fluid.transforms.free",
                args: {
                    "dataSet": "{that}.model.dataSet",
                    "colors": "{that}.options.legendOptions.colors"
                },
                func: "gpii.chartAuthoring.pieChart.legend.consolidateDataAndColors"
            }
        }],
        styles: {
            legend: "gpii-ca-pieChart-legend",
            table: "gpii-ca-pieChart-legend-table",
            row: "gpii-ca-pieChart-legend-table-row",
            colorCell: "gpii-ca-pieChart-legend-color-cell",
            labelCell: "gpii-ca-pieChart-legend-label-cell",
            valueCell: "gpii-ca-pieChart-legend-value-cell"
        },
        selectors: {
            legend: ".gpiic-ca-pieChart-legend",
            table: ".gpii-ca-pieChart-legend-table",
            row: ".gpii-ca-pieChart-legend-table-row",
            colorCell: ".gpii-ca-pieChart-legend-color-cell",
            labelCell: ".gpii-ca-pieChart-legend-label-cell",
            valueCell: ".gpii-ca-pieChart-legend-value-cell"
        },
        events: {
            onLegendCreated: null  // Fire when the legend is created. Ready to register D3 DOM event listeners
        },
        listeners: {
            "onCreate.create": {
                funcName: "gpii.chartAuthoring.pieChart.legend.create",
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
                funcName: "gpii.chartAuthoring.pieChart.legend.draw",
                args: ["{that}"]
            },
            sort: {
                funcName: "gpii.chartAuthoring.pieChart.legend.sort",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            getColorCellStyle: {
                funcName: "gpii.chartAuthoring.pieChart.legend.getColorCellStyle",
                args: ["{arguments}.0"]
            }
        }
    });

    // Takes the dataSet array and the color array, and returns a consolidated object array to ease sorting and other operations while keeping colors "correct"
    gpii.chartAuthoring.pieChart.legend.consolidateDataAndColors = function (model) {
        var dataSet = model.dataSet;
        var colors = (typeof(model.colors) === "function") ? model.colors : gpii.d3.getColorScale(model.colors);

        var consolidated = [];
        fluid.each(dataSet, function(item, i) {
            var oneConsolidated = {
                id: item.id,
                label: item.label,
                value: item.value,
                color: colors(i)
            };
            consolidated.push(oneConsolidated);
        });

        return consolidated;

    };

    gpii.chartAuthoring.pieChart.legend.draw = function (that) {
        var table = that.table,
            legendOptions = that.options.legendOptions,
            dataSet = that.model.dataSetWithColors,
            rowClass = that.classes.row,
            colorCellClass = that.classes.colorCell,
            labelCellClass = that.classes.labelCell,
            valueCellClass = that.classes.valueCell,
            sort = legendOptions.sort;
        var tbody = table.selectAll("tbody");

        var rows = tbody.selectAll("tr")
            .data(dataSet, function (d) {
                return d.id;
            });

        // Add new rows for new data, apply appropriate classes for selectors and styling

        var addedRows = rows.enter().append("tr");

        addedRows
        .attr({
            "class": rowClass
        });

        addedRows
        .append("td")
        .attr({
            "class": colorCellClass
        });

        addedRows
        .append("td")
        .attr({
            "class": labelCellClass
        });

        addedRows
        .append("td")
        .attr({
            "class": valueCellClass
        });

        // Update cell legend colours, labels and values
        rows.each(function (d) {
            d3.select(this).select("." + colorCellClass)
            .attr({
                "style": that.getColorCellStyle(d)
            });
            d3.select(this).select("." + labelCellClass)
            .text(d.label);
            d3.select(this).select("." + valueCellClass)
            .text(d.value);
        });

        var removedRows = rows.exit();

        removedRows.remove();

        if (sort) {
            rows.sort(that.sort);
        }
    };

    gpii.chartAuthoring.pieChart.legend.create = function (that) {
        var container = that.container,
            tableClass = that.classes.table,
            showLegendHeadings = that.options.legendOptions.showLegendHeadings;

        that.table = that.jQueryToD3(container)
            .append("table")
            .attr({
            "class": tableClass
        });

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

    gpii.chartAuthoring.pieChart.legend.sort = function (a, b) {
        return b.value - a.value;
    };

    gpii.chartAuthoring.pieChart.legend.getColorCellStyle = function (data) {
        return "background-color: " + data.color + ";";
    };

})(jQuery, fluid);
