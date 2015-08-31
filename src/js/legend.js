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
        },
        legendOptions: {
            colors: null, // An array of colors for the legend generated for corresponding values of model.dataSet
            sort: true // Whether or not to sort the data by values when creating the legend
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
            legendColorCell: "gpii-ca-pieChart-legend-color-cell",
            labelCell: "gpii-ca-pieChart-legend-label-cell",
            valueCell: "gpii-ca-pieChart-legend-value-cell"
        },
        selectors: {
            legend: ".gpiic-ca-pieChart-legend",
            table: ".gpii-ca-pieChart-legend-table",
            row: ".gpii-ca-pieChart-legend-table-row",
            legendColorCell: ".gpii-ca-pieChart-legend-color-cell",
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
            }
        }
    });

    // Return a D3 color scale based on user supplied colors or the d3.scale.category10() defaults

    gpii.chartAuthoring.pieChart.legend.getColorScale = function (colors) {
      return colors ? d3.scale.ordinal().range(colors) : d3.scale.category10();
    };

    // Takes the dataSet array and the color array, and returns a consolidated object array to ease sorting and other operations while keeping colors "correct"

    gpii.chartAuthoring.pieChart.legend.consolidateDataAndColors = function (model) {
      var dataSet = model.dataSet;
      var color = gpii.chartAuthoring.pieChart.legend.getColorScale(model.colors);

        var c = [];
        for(var i=0; i<dataSet.length; i++) {
            var d = {
                id: dataSet[i].id,
                label: dataSet[i].label,
                value: dataSet[i].value,
                color: color(i)
            };
            c.push(d);
        }
        return c;

    };

    gpii.chartAuthoring.pieChart.legend.draw = function (that) {        
        var table = that.table,
            l = that.options.legendOptions,
            dataSet = that.model.dataSetWithColors,
            rowClass = that.classes.row,
            legendColorCellClass = that.classes.legendColorCell,
            legendLabelCellClass = that.classes.labelCell,
            legendValueCellClass = that.classes.valueCell,
            sort = l.sort;
        var tbody = table.selectAll("tbody");

        var rows = tbody.selectAll("tr")
            .data(dataSet, function (d) {
                return d.id;
            });

        var addedRows = rows.enter().append("tr");

        addedRows
        .attr({
            "class": rowClass
        });

        addedRows
        .append("td")
        .attr({
            "style": function (d) {
                return "background-color: "+d.color+";";
            },
            "class": legendColorCellClass
        });

        addedRows
        .append("td")
        .attr({
            "class": legendLabelCellClass
        })
        .html(function (d) {
            return d.label;
        });

        addedRows.append("td")
        .attr({
            "class": legendValueCellClass
        })
        .html(function (d) {
            return d.value;
        });

        var removedRows = rows.exit();

        removedRows.remove();

        if(sort === true) {
            rows.sort(function (a,b){
                return b.value - a.value;
            });
        }
    };

    gpii.chartAuthoring.pieChart.legend.create = function (that) {
        var container = that.container,
            dataSet = that.model.dataSet,
            l = that.options.legendOptions,
            colors = l.colors,
            tableClass = that.classes.table;

        if (dataSet.length === 0) {
            return;
        }

        that.color = gpii.chartAuthoring.pieChart.legend.getColorScale(colors);

        that.table = that.jQueryToD3(container)
            .append("table")
            .attr({
            "class": tableClass
        });

        that.table.append("thead");
        that.table.append("tbody");

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

        that.draw();

        that.events.onLegendCreated.fire();
    };

})(jQuery, fluid);
