/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.chartAuthoring", {
        gradeNames: ["fluid.viewComponent"],
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
                type: "gpii.chartAuthoring.dataEntryPanel",
                createOnEvent: "onPieChartReady",
                container: "{dataEntryPanel}.container",
                options: {
                    resources: {
                        template: "{templateLoader}.resources.dataEntryPanel",
                        dataEntry: "{templateLoader}.resources.dataEntry"
                    },
                    modelRelay: {
                        source: "{that}.model.dataEntries",
                        target: "{gpii.chartAuthoring.pieChart}.model.dataSet",
                        singleTransform: {
                            type: "fluid.transforms.free",
                            args: ["{that}.model.dataEntries"],
                            func: "gpii.chartAuthoring.dataEntriesToPieChartData"
                        },
                        forward: "liveOnly",
                        backward: "never"
                    },
                    events: {
                        onCreate: "{chartAuthoring}.events.onPanelReady"
                    }
                }
            },
            pieChart: {
                type: "gpii.chartAuthoring.pieChart",
                createOnEvent: "onTemplatesLoaded",
                container: "{pieChart}.container",
                options: {
                    resources: {
                        template: "{templateLoader}.resources.pieChart"
                    },
                    listeners: {
                        "onPieChartReady.escalate": {
                            funcName: "{chartAuthoring}.events.onPieChartReady.fire"
                        }
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
        },
        {
            source: "{that}.options.dataEntryPanel.container",
            removeSource: true,
            target: "{that > dataEntryPanel}.container"
        },
        {
            source: "{that}.options.pieChart.container",
            removeSource: true,
            target: "{that > pieChart}.container"
        }]
    });

    // Given an object in the style of gpii.chartAuthoring.dataEntryPanel.model.dataEntries,
    // convert it to an array of objects in the style used by the pieChart components,
    // maintaining object constancy by using the dataEntry object name as the key
    gpii.chartAuthoring.dataEntriesToPieChartData = function(dataEntries) {

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
