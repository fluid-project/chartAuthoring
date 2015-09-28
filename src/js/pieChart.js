/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/floe/universal/LICENSE.txt
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
                createOnEvent: "onParentReady",
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
                createOnEvent: "onParentReady",
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
            // sort: boolean   // Whether or not to sort the data by values when creating the legend
            // pieTitle: the accessible title to be applied to the pie chart
            // pieDescription: the accessible description to be applied to the pie chart
        },
        selectors: {
            pie: ".floec-ca-pieChart-pie",
            legend: ".floec-ca-pieChart-legend"
        },
        listeners: {
            "onCreate.renderTemplate": "floe.chartAuthoring.pieChart.renderTemplate"
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
            },
            onParentReady: null
        },
        // Supplied by implementer
        resources: {
            template: {}
        }
    });

    floe.chartAuthoring.pieChart.renderTemplate = function (that) {
        that.events.onParentReady.fire();
    };

    floe.chartAuthoring.pieChart.consolidateDrawingOptions = function (userOptions) {
        var consolidatedOptions = fluid.copy(userOptions);
        fluid.set(consolidatedOptions, "colors", floe.d3.getColorScale(userOptions.colors));
        return consolidatedOptions;
    };

})(jQuery, fluid);
