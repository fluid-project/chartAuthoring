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
        model: {
            // dataSet accepts:
            // 1. an array of objects. Must contain "id", "value" and "label" variables.
            // Example: [{id: string, value: number, label: string} ... ]
            dataSet: []
        },
        legendOptions: {
            width: 300,
            height: 300,
            colors: null, // An array of colors for the legend generated for corresponding values of model.dataSet
            sort: true // Whether or not to sort the data by values when creating the legend
        },
        styles: {
            legend: "gpii-ca-pieChart-legend",
            table: "gpii-ca-pieChart-legend-table",
            row: "gpii-ca-pieChart-legend-table-row"
        },
        selectors: {
            legend: ".gpiic-ca-pieChart-legend",
            table: ".gpii-ca-pieChart-legend-table",
            row: ".gpii-ca-pieChart-legend-table-row"
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

    gpii.chartAuthoring.pieChart.legend.draw = function(that) {
        // console.log("gpii.chartAuthoring.pieChart.legend.draw function");

        var table = that.table,
            l = that.options.legendOptions,
            color = that.color,
            dataSet = that.model.dataSet,
            rowClass = that.classes.row,
            sort = l.sort;
        var tbody = table.selectAll("tbody");

        var rows = tbody.selectAll("tr")
            .data(dataSet, function(d) {
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
          "style": function(d, i) {
            return "background-color: "+color(i)+";";
          }
        });

        addedRows
        .append("td")
        .html(function(d, i) {
          return d.label;
        });

        addedRows.append("td")
        .html(function(d,i) {
          return d.value;
        });

        var removedRows = rows.exit();

        removedRows.remove();


        if(sort === true) {
          rows.sort(function(a,b){
            return b.value - a.value;
          });
        }

    };

    gpii.chartAuthoring.pieChart.legend.create = function(that) {
      // console.log("gpii.chartAuthoring.pieChart.legend.create function");
      var container = that.container,
          dataSet = that.model.dataSet,
          l = that.options.legendOptions,
          colors = l.colors,
          legendClass = that.classes.legend,
          tableClass = that.classes.table;

          if (dataSet.length === 0) {
              return;
          }

          that.color = colors ? d3.scale.ordinal().range(colors) : d3.scale.category10();

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
               .html("Legend");

          thead.append("th")
               .attr({
                 "scope":"col"
               })
               .html("Label");

          thead.append("th")
          .attr({
            "scope":"col"
          })
          .html("Value");

          that.draw();

          that.events.onLegendCreated.fire();

    };

})(jQuery, fluid);
