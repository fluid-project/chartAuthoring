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

    fluid.defaults("floe.chartAuthoring", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            chartTitle: ".floec-chartTitle",
            chartDescription: ".floec-chartDescription",
            dataEntryPanel: ".floec-dataEntryPanel",
            pieChart: ".floec-pieChart",
            sonifierPlay: ".floec-sonifierPlay",
            sonifierStop: ".floec-sonifierStop"
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
            chartAuthoringInterface: {
                type: "floe.chartAuthoring.templateInjection",
                createOnEvent: "onTemplatesLoaded",
                container: "{that}.dom.container",
                options: {
                    selectors: {
                        reset: ".floec-ca-dataEntryPanel-reset"
                    },
                    styles: {
                        reset: "floe-ca-dataEntryPanel-reset"
                    },
                    resources: {
                        template: "{templateLoader}.resources.chartAuthoringInterface"
                    },
                    listeners: {
                        "onTemplateInjected.escalate": "{chartAuthoring}.events.onChartAuthoringInterfaceReady.fire",
                        "onCreate.bindResetClick": {
                            "this": "{that}.dom.reset",
                            "method": "click",
                            "args": ["{chartAuthoring}.resetDataEntryPanel"]
                        }
                    },
                    components: {
                        chartTitle: {
                            type: "fluid.inlineEdit",
                            container: "{chartAuthoring}.dom.chartTitle",
                            createOnEvent: "{chartAuthoring}.events.onPieChartReady",
                            options: {
                                strings: {
                                    defaultViewText: "{floe.chartAuthoring}.options.strings.defaultTitleText"
                                },
                                listeners: {
                                    "afterFinishEdit.modelChange": {
                                        func: "{pieChart}.applier.change",
                                        args: ["svgTitle", "{arguments}.0"]
                                    }
                                }
                            }
                        },
                        chartDescription: {
                            type: "fluid.inlineEdit",
                            container: "{chartAuthoring}.dom.chartDescription",
                            createOnEvent: "{chartAuthoring}.events.onPieChartReady",
                            options: {
                                strings: {
                                    defaultViewText: "{floe.chartAuthoring}.options.strings.defaultDescriptionText"
                                },
                                listeners: {
                                    "afterFinishEdit.modelChange": {
                                        func: "{pieChart}.applier.change",
                                        args: ["svgDescription", "{arguments}.0"]
                                    }
                                }
                            }

                        },
                        dataEntryPanel: {
                            type: "floe.chartAuthoring.dataEntryPanel",
                            createOnEvent: "{chartAuthoring}.events.onPieChartReady",
                            container: "{chartAuthoring}.dom.dataEntryPanel",
                            options: {
                                resources: {
                                    template: "{templateLoader}.resources.dataEntryPanel",
                                    dataEntry: "{templateLoader}.resources.dataEntry"
                                },
                                modelRelay: {
                                    source: "{that}.model.dataSet",
                                    target: "{pieChart}.model.dataSet",
                                    singleTransform: {
                                        type: "fluid.transforms.free",
                                        args: ["{that}.model.dataSet"],
                                        func: "floe.chartAuthoring.dataEntriesToPieChartData"
                                    }
                                },
                                listeners: {
                                    "onCreate.escalate": {
                                        funcName: "{chartAuthoring}.events.onPanelReady.fire"
                                    }
                                }
                            }
                        },
                        pieChart: {
                            type: "floe.chartAuthoring.pieChart",
                            createOnEvent: "{chartAuthoring}.events.onChartAuthoringInterfaceReady",
                            container: "{chartAuthoring}.dom.pieChart",
                            options: {
                                resources: {
                                    template: "{templateLoader}.resources.pieChart"
                                },
                                listeners: {
                                    "onPieChartReady.escalate": "{chartAuthoring}.events.onPieChartReady.fire"
                                }
                            }
                        },

                        sonifier: {
                            type: "floe.chartAuthoring.sonifier",
                            createOnEvent: "{chartAuthoring}.events.onPanelReady",
                            options: {
                                model: {
                                    "dataSet": "{dataEntryPanel}.model.dataSet"
                                },
                                listeners: {
                                    "onCreate.escalate": {
                                        funcName: "{chartAuthoring}.events.onSonifierReady.fire"
                                    }
                                },
                                modelRelay: {
                                    source: "{that}.model.currentlyPlayingData",
                                    target: "{floe.chartAuthoring.pieChart}.model.activeDataId",
                                    singleTransform: {
                                        type: "fluid.transforms.free",
                                        args: "{that}.model.currentlyPlayingData",
                                        func: "floe.d3.idExtractor"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        events: {
            onTemplatesLoaded: null,
            onChartAuthoringInterfaceReady: null,
            onPanelReady: null,
            onPieChartReady: null,
            onSonifierReady: null,
            onToolReady: {
                events: {
                    onPanelReady: "onPanelReady",
                    onPieChartReady: "onPieChartReady",
                    onSonifierReady: "onSonifierReady"
                },
                args: ["{that}"]
            }
        },
        listeners: {
            "onToolReady.addAriaConnections": "floe.chartAuthoring.addAriaConnections",
            "onToolReady.bindPlayClick": {
                "this": "{that}.dom.sonifierPlay",
                "method": "click",
                "args": ["{chartAuthoringInterface}.sonifier.events.onSonificationRequested.fire"]
            },
            "onToolReady.bindStopClick": {
                "this": "{that}.dom.sonifierStop",
                "method": "click",
                "args": ["{chartAuthoringInterface}.sonifier.stopSonification"]
            }
        },
        invokers: {
            "updateDataEntryPanelFromDataSet": {
                funcName: "floe.chartAuthoring.updateDataEntryPanelFromDataSet",
                args: ["{that}", "{arguments}.0"]
            },
            "resetDataEntryPanel": {
                funcName: "floe.chartAuthoring.updateDataEntryPanelFromDataSet",
                args: ["{that}", []]
            }
        },
        strings: {
            defaultTitleText: "Enter Chart Title",
            defaultDescriptionText: "Enter Chart Description"
        },
        // The terms and/or resources need to be set to the appropriate locations
        // by the integrator.
        templateLoader: {
            terms: {
                templatePrefix: ""
            },
            resources: {
                chartAuthoringInterface: "%templatePrefix/chartAuthoringInterfaceTemplate.html",
                dataEntryPanel: "%templatePrefix/dataEntryPanelTemplate.html",
                dataEntry: "%templatePrefix/dataEntryTemplate.html",
                pieChart: "%templatePrefix/pieChartTemplate.html"
            }
        },
        inlineEditCommonOptions: {
            selectors: {
                text: ".floec-inlineEdit-text"
            },
            styles: {
                text: "floe-inlineEdit-text"
            }
        },
        distributeOptions: [{
            source: "{that}.options.templateLoader",
            removeSource: true,
            target: "{that > templateLoader}.options"
        },
        {
            source: "{that}.options.pieChart",
            removeSource: true,
            target: "{that pieChart}.options"
        },
        {
            source: "{that}.options.dataEntryPanel",
            removeSource: true,
            target: "{that dataEntryPanel}.options"
        },
        {
            source: "{that}.options.inlineEditCommonOptions",
            removeSource: true,
            target: "{that fluid.inlineEdit}.options"
        }]
    });

    // Given an object in the style of floe.chartAuthoring.dataEntryPanel.model.dataSet,
    // convert it to an array of objects in the style used by the pieChart components,
    // maintaining object constancy by using the dataEntry object name as the key
    floe.chartAuthoring.dataEntriesToPieChartData = function (dataSet) {

        var pieChartData = [];
        fluid.each(dataSet, function (item, key) {
            var d = {
                id: key,
                label: item.label,
                value: item.value
            };
            if (d.value !== null) {
                pieChartData.push(d);
            }
        });
        return pieChartData;
    };

    // Adds aria attributes that only make sense within the context of the overall chart authoring tool
    // Specifically, adds:
    // - an aria-controls attribute for the dataEntryPanel's form referencing the unique IDs of the pie and legend
    // - an aria-controls attribute for the reset button referencing the dataEntryPanel form
    floe.chartAuthoring.addAriaConnections = function (that) {
        var legendId = fluid.allocateSimpleId(that.chartAuthoringInterface.pieChart.legend.locate("table")),
            pieId = fluid.allocateSimpleId(that.chartAuthoringInterface.pieChart.pie.locate("pie")),
            totalId = fluid.allocateSimpleId(that.chartAuthoringInterface.dataEntryPanel.locate("totalValue")),
            dataEntryFormId = fluid.allocateSimpleId(that.chartAuthoringInterface.dataEntryPanel.locate("dataEntryForm"));

        that.chartAuthoringInterface.dataEntryPanel.locate("dataEntryForm").attr("aria-controls", legendId + " " + pieId + " " + totalId);
        that.chartAuthoringInterface.locate("reset").attr("aria-controls", dataEntryFormId + " " + legendId + " " + pieId + " " + totalId);
    };

    // Updates the chart authoring tool's data entry panel to the provided dataset
    // Passing an empty dataset will clear and reset the form
    // Triggers change events to trigger model updating and propagation to other
    // interface elements
    floe.chartAuthoring.updateDataEntryPanelFromDataSet = function (that, dataSet) {
        // Clear any existing data entries
        var dataEntries = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntry");

        var dataEntryLabelSelector = that.chartAuthoringInterface.dataEntryPanel.dataEntry.options.selectors.label;
        var dataEntryValueSelector = that.chartAuthoringInterface.dataEntryPanel.dataEntry.options.selectors.value;

        dataEntries.each(function (idx) {
            var currentData = dataSet[idx] !== undefined ? dataSet[idx] : {label: "", value: ""};
            $(this).find(dataEntryLabelSelector).val(currentData.label).trigger("change");
            $(this).find(dataEntryValueSelector).val(currentData.value).trigger("change");
        });
    };

})(jQuery, fluid);
