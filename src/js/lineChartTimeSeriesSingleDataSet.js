/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    // Draws time series line charts

    fluid.defaults("floe.chartAuthoring.lineChart.timeSeriesSingleDataSet", {
        gradeNames: ["floe.chartAuthoring.lineChart.timeSeriesMultiDataSet"],
        model: {
            dataSet: []
        },
        modelRelay: {
            source: "{that}.model.dataSet",
            target: "{that}.model.dataSet",
            singleTransform: {
                type: "fluid.transforms.free",
                args: ["{that}.model.dataSet"],
                func: "floe.chartAuthoring.lineChart.timeSeriesSingleDataSet.wrapSingleDataSet"
            }
        }
    });

    // Wrap a non-multi dataset (a simple array without ID keys) so we can
    // process it with the same components used for multi datasets, and
    // create a default id for it for object constancy
    floe.chartAuthoring.lineChart.timeSeriesSingleDataSet.wrapSingleDataSet = function (dataSet) {
            dataSet = [{
                id: "dataSet",
                data: dataSet
            }];

            return dataSet;
        };

})(jQuery, fluid);
