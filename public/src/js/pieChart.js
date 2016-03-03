/*
Copyright 2015-2016 OCAD University

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
                    svgOptions: "{pieChart}.options.svgOptions",
                    model: {
                        dataSet: "{pieChart}.model.dataSet",
                        svgTitle: "{pieChart}.model.svgTitle",
                        svgDescription: "{pieChart}.model.svgDescription",
                        activeSliceId: "{pieChart}.model.activeDataId"
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
                        dataSet: "{pieChart}.model.dataSet",
                        activeRowId: "{pieChart}.model.activeDataId"
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
            dataSet: [],
            svgTitle: "Pie Chart",
            svgDescription: "A pie chart."
            // activeDataId: relayed to activeRowId/activeSliceId of legend/pie

        },
        svgOptions: {
            // width: number,
            // height: number
        },
        pieChartOptions: {
            // colors: array, // An array of colors to fill slices generated for corresponding values of model.dataSet
            // outerRadius: number,
            // innerRadius: number,
            // animationDuration: number,
            // sort: boolean   // Whether or not to sort the data by values when creating the legend,
            // sliceTextDisplayTemplate: string // fluid.stringTemplate to format the pie chart slice text
            // sliceTextPercentageDigits: number // number of digits after decimal for percentages in pie chart slice text
            // labelTextDisplayTemplate: string // fluid.stringTemplate to format the legend label cell
            // valueTextDisplayTemplate: string // fluid.stringTemplate to format the legend value cell
            // legendPercentageDigits: number // number of digits after decimal for percentages in legend display
            // displayPieBackground: boolean // whether to draw a background circle behind the pie
            // pieBackgroundColor: string // color of the background circle, if drawn
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
