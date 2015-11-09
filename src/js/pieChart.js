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

    // Connects the drawing of the pie (floe.chartAuthoring.pieChart.pie) and the legend (floe.chartAuthoring.pieChart.legend)
    fluid.defaults("floe.chartAuthoring.pieChart", {
        gradeNames: ["floe.chartAuthoring.templateInjection", "autoInit"],
        members: {
            drawingOptions: {
                expander: {
                    funcName: "floe.chartAuthoring.pieChart.consolidateDrawingOptions",
                    args: ["{that}.options.pieChartOptions"]
                }
            }
        },
        components: {
            pie: {
                type: "floe.chartAuthoring.pieChart.pie",
                createOnEvent: "onTemplateInjected",
                container: "{that}.dom.pie",
                options: {
                    pieOptions: "{pieChart}.drawingOptions",
                    strings: {
                        pieTitle: "{pieChart}.options.pieChartOptions.pieTitle",
                        pieDescription: "{pieChart}.options.pieChartOptions.pieDescription"
                    },
                    model: {
                        dataSet: "{pieChart}.model.dataSet"
                    },
                    events: {
                        onPieCreated: "{pieChart}.events.onPieCreated",
                        onPieRedrawn: "{pieChart}.events.onPieRedrawn"
                    }
                }
            },
            legend: {
                type: "floe.chartAuthoring.pieChart.legend",
                createOnEvent: "onTemplateInjected",
                container: "{that}.dom.legend",
                options: {
                    legendOptions: "{pieChart}.drawingOptions",
                    strings: {
                        legendTitle: "{pieChart}.options.pieChartOptions.legendTitle"
                    },
                    model: {
                        dataSet: "{pieChart}.model.dataSet"
                    },
                    events: {
                        onLegendCreated: "{pieChart}.events.onLegendCreated",
                        onLegendRedrawn: "{pieChart}.events.onLegendRedrawn"
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
            // sort: boolean   // Whether or not to sort the data by values when creating the legend,
            // pieTitle: the accessible title to be applied to the pie chart,
            // pieDescription: the accessible description to be applied to the pie chart,
            // sliceTextDisplayTemplate: fluid.stringTemplate to format the pie chart slice text
            // sliceTextPercentageDigits: number of digits after decimal for percentages in pie chart slice text
            // labelTextDisplayTemplate: fluid.stringTemplate to format the legend label cell
            // valueTextDisplayTemplate: fluid.stringTemplate to format the legend value cell
            // legendPercentageDigits: number of digits after decimal for percentages in legend display
        },
        selectors: {
            pie: ".floec-ca-pieChart-pie",
            legend: ".floec-ca-pieChart-legend"
        },
        events: {
            onPieCreated: null,
            onLegendCreated: null,
            onPieRedrawn: null,
            onLegendRedrawn: null,
            onPieChartReady: {
                events: {
                    onPieCreated: "onPieCreated",
                    onLegendCreated: "onLegendCreated"
                },
                args: ["{that}"]
            },
            onPieChartRedrawn: {
                events: {
                    onPieRedrawn: "onPieRedrawn",
                    onLegendRedrawn: "onLegendRedrawn"
                }
            }
        },
        // Supplied by implementer
        resources: {
            template: {}
        }
    });
    floe.chartAuthoring.pieChart.consolidateDrawingOptions = function (userOptions) {
        var consolidatedOptions = fluid.copy(userOptions);
        fluid.set(consolidatedOptions, "colors", floe.d3.getColorScale(userOptions.colors));
        return consolidatedOptions;
    };

})(jQuery, fluid);
