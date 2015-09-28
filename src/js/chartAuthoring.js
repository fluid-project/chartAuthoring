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

    fluid.defaults("floe.chartAuthoring", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            dataEntryPanel: ".floec-dataEntryPanel",
            pieChart: ".floec-pieChart"
        },
        components: {
            templateLoader: {
                type: "fluid.prefs.resourceLoader",
                options: {
                    events: {
                        onResourcesLoaded: "{chartAuthoring}.events.onTemplatesLoaded"
                    }
                }
            },
            dataEntryPanel: {
                type: "floe.chartAuthoring.dataEntryPanel",
                createOnEvent: "onPieChartReady",
                container: "{that}.dom.dataEntryPanel",
                options: {
                    resources: {
                        template: "{templateLoader}.resources.dataEntryPanel",
                        dataEntry: "{templateLoader}.resources.dataEntry"
                    },
                    modelRelay: {
                        source: "{that}.model.dataEntries",
                        target: "{floe.chartAuthoring.pieChart}.model.dataSet",
                        singleTransform: {
                            type: "fluid.transforms.free",
                            args: ["{that}.model.dataEntries"],
                            func: "floe.chartAuthoring.dataEntriesToPieChartData"
                        },
                        forward: "liveOnly",
                        backward: "never"
                    },
                    listeners: {
                        "onCreate.escalate": {
                            funcName: "{chartAuthoring}.events.onPanelReady.fire",
                            priority: "last"
                        }
                    }
                }
            },
            pieChart: {
                type: "floe.chartAuthoring.pieChart",
                createOnEvent: "onTemplatesLoaded",
                container: "{that}.dom.pieChart",
                options: {
                    resources: {
                        template: "{templateLoader}.resources.pieChart"
                    },
                    listeners: {
                        "onPieChartReady.escalate": "{chartAuthoring}.events.onPieChartReady.fire"

                    }
                }
            }
        },
        events: {
            onTemplatesLoaded: null,
            onPanelReady: null,
            onPieChartReady: null,
            onToolReady: {
                events: {
                    onPanelReady: "onPanelReady",
                    onPieChartReady: "onPieChartReady"
                },
                args: ["{that}"]
            }
        },
        // The terms and/or resources need to be set to the appropriate locations
        // by the integrator.
        templateLoader: {
            terms: {
                templatePrefix: ""
            },
            resources: {
                dataEntryPanel: "%templatePrefix/dataEntryPanelTemplate.html",
                dataEntry: "%templatePrefix/dataEntryTemplate.html",
                pieChart: "%templatePrefix/pieChartTemplate.html"
            }
        },
        distributeOptions: [{
            source: "{that}.options.templateLoader",
            removeSource: true,
            target: "{that > templateLoader}.options"
        }]
    });

    // Given an object in the style of floe.chartAuthoring.dataEntryPanel.model.dataEntries,
    // convert it to an array of objects in the style used by the pieChart components,
    // maintaining object constancy by using the dataEntry object name as the key
    floe.chartAuthoring.dataEntriesToPieChartData = function(dataEntries) {

        var pieChartData = [];
        fluid.each(dataEntries, function(item, key) {
            var d = {
                id: key,
                label: item.label,
                value: item.value
            };
            if(d.value !== null) {
                pieChartData.push(d);
            }
        });
        return pieChartData;
    };
})(jQuery, fluid);
