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

    // Connects the drawing of the pie (gpii.chartAuthoring.pieChart.pie) and the legend (gpii.chartAuthoring.pieChart.legend)
    fluid.defaults("gpii.chartAuthoring.pieChart", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        members: {
            drawingOptions: {
                expander: {
                    funcName: "gpii.chartAuthoring.pieChart.consolidateDrawingOptions",
                    args: ["{that}.options.pieChartOptions"]
                }
            }
        },
        components: {
            pie: {
                type: "gpii.chartAuthoring.pieChart.pie",
                container: "{that}.dom.pie",
                options: {
                    pieOptions: "{pieChart}.drawingOptions",
                    model: {
                        dataSet: "{pieChart}.model.dataSet"
                    },
                    events: {
                        onPieCreated: "{pieChart}.events.onPieCreated"
                    }
                }
            },
            legend: {
                type: "gpii.chartAuthoring.pieChart.legend",
                container: "{that}.dom.legend",
                options: {
                    legendOptions: "{pieChart}.drawingOptions",
                    model: {
                        dataSet: "{pieChart}.model.dataSet"
                    },
                    events: {
                        onLegendCreated: "{pieChart}.events.onLegendCreated"
                    }
                }
            }
        },
        model: {
            // dataSet accepts an array of objects in a format of
            // [{id: string, value: number, label: string}, ... ]
            dataSet: []
        },
        pieChartOptions: {
            // width: number,
            // height: number,
            // colors: array, // An array of colors to fill slices generated for corresponding values of model.dataSet
            // outerRadius: number,
            // innerRadius: number,
            // animationDuration: number,
            // sort: boolean   // Whether or not to sort the data by values when creating the legend
        },
        selectors: {
            pie: ".gpiic-ca-pieChart-pie",
            slice: ".gpiic-ca-pieChart-legend"
        },
        events: {
            onPieCreated: null,
            onLegendCreated: null,
            onPieChartReady: {
                events: {
                    onPieCreated: "onPieCreated",
                    onLegendCreated: "onLegendCreated"
                },
                args: ["{that}"]
            }
        }
    });

    gpii.chartAuthoring.pieChart.consolidateDrawingOptions = function (userOptions) {
        var consolidatedOptions = fluid.copy(userOptions);
        fluid.set(consolidatedOptions, "colors", gpii.d3.getColorScale(userOptions.colors));
        return consolidatedOptions;
    };

})(jQuery, fluid);
