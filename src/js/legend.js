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
            // 1. an array of primitive values, such as numbers;
            // 2. an array of objects. Must contain "value" and "label" variables.
            // Example: [{id: string, value: number, label: string} ... ]
            dataSet: []
        },
        legendOptions: {
            width: 300,
            height: 300,
            colors: null // An array of colors for the legend generated for corresponding values of model.dataSet
        },
        styles: {
            legend: "gpii-ca-pieChart-legend",
            table: "gpii-ca-pieChart-table"
        },
        selectors: {
            legend: ".gpiic-ca-pieChart-legend",
            table: ".gpii-ca-pieChart-table"
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
            color = that.color,
            dataSet = that.model.dataSet;

        var thead = table.selectAll("thead");

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

        var tbody = table.selectAll("tbody");

        var rows = tbody.selectAll("tr")
            .data(dataSet)
            .enter()
            .append("tr");

        rows.append("td")
        .attr({
          "style": function(d, i) {
            return "background-color: "+color(i)+";";
          }
        })
        .html(function(d, i) {
          return d.label;
        });

        rows.append("td")
        .html(function(d,i) {
          return d.value;
        });
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

          that.draw();

          that.events.onLegendCreated.fire();

    };

})(jQuery, fluid);
