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
        gradeNames: ["fluid.modelComponent"],
        model: {
            total: {
                // value: number,
                // percentage: number
            },
            dataSet: {
                // in the style of the dataSet in dataEntryPanel or pie/legend
                // dataEntryPanel's model.dataSet values looks like:
                // {uuid: {value: ""}, uuid:{value: ""}...}
                // pie/legend look like:
                // [{value: ""},{value: ""}...]
                // basically, any collection of objects where the objects have
                // a "value" parameter should work
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
