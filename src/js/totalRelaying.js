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

    fluid.defaults("floe.chartAuthoring.totalRelaying", {
        gradeNames: ["fluid.modelComponent", "autoInit"],
        model: {
            total: {
                // value: number,
                // percentage: number
            }
        },
        modelRelay: [{
            source: "dataSet",
            target: "total.value",
            singleTransform: {
                type: "floe.chartAuthoring.transforms.reduce",
                value: "{that}.model.dataSet",
                initialValue: null,
                extractor: "floe.chartAuthoring.transforms.reduce.valueExtractor",
                func: "floe.chartAuthoring.transforms.reduce.add"
            }
        }, {
            source: "total.value",
            target: "total.percentage",
            singleTransform: {
                type: "floe.chartAuthoring.transforms.percentage",
                value: "{that}.model.total.value",
                total: "{that}.model.total.value"
            }
        }]
    });

})(jQuery, fluid);
