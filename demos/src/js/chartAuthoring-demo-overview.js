/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

var demo = demo || {};

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("demo.chartAuthoring");

    fluid.defaults("floe.chartAuthoring.demo.overview", {
            gradeNames: ["fluid.viewComponent", "autoInit"],
            components: {
                overviewPanel: {
                    type: "fluid.overviewPanel",
                    container: "{overview}.container",
                    options: {
                        model: {
                            showPanel: "{storeModel}.model.showPanel"
                        },
                        modelListeners: {
                            "": {
                                funcName: "{storeModel}.set",
                                args: "{change}.value",
                                excludeSource: "init"
                            }
                        }
                    }
                },
                storeModel: {
                    type: "fluid.modelComponent",
                    options: {
                        gradeNames: ["fluid.prefs.cookieStore"],
                        model: {
                            expander: {
                                funcName: "{that}.get"
                            }
                        }
                    }
                }
            },
            distributeOptions: [{
                source: "{that}.options.overviewPanelTemplate",
                removeSource: true,
                target: "{that > overviewPanel}.options.resources.template.href"
            }, {
                source: "{that}.options.strings",
                removeSource: true,
                target: "{that > overviewPanel}.options.strings"
            }, {
                source: "{that}.options.markup",
                removeSource: true,
                target: "{that > overviewPanel}.options.markup"
            }, {
                source: "{that}.options.links",
                removeSource: true,
                target: "{that > overviewPanel}.options.links"
            }, {
                source: "{that}.options.cookieName",
                removeSource: true,
                target: "{that > storeModel}.options.cookie.name"
            }]
        });

    $(document).ready(function () {
        floe.chartAuthoring.demo.overview("#floec-overviewPanel", {
            overviewPanelTemplate: "src/html/overviewPanelTemplate-chartAuthoring.html",
            cookieName: "chartAuthoring-demo-showPanel",
            strings: {
                componentName: "Chart Authoring Tool",
                infusionCodeLinkText: "get Chart Authoring",
                titleBegin: "A",
                titleLinkText: "Chart Authoring"
            },
            markup: {
                description: "The Chart Authoring Tool supports the authoring, export and embedding of highly accessible charts, including sonification of the data. The current version supports creating pie charts and transforming the data into sonified form via a pattern where long notes represent 10% of the pie chart and short tones represent 1%. Anticipated future development includes supporting other kinds of charts, providing other sonification strategies for data, and export functionality.",
                instructions: "<p>Enter labels and data for your pie chart in the data entry area. The pie chart and its corresponding legend will update each time you update your data. Use the play button to hear the current chart sonification or the stop button to stop a sonification before it finishes.</p>"
            },
            links: {
                titleLink: "https://github.com/fluid-project/chartAuthoring",
                demoCodeLink: "https://github.com/fluid-project/chartAuthoring/tree/master/demos",
                infusionCodeLink: "https://github.com/fluid-project/chartAuthoring",
                feedbackLink: "mailto:infusion-users@fluidproject.org?subject=Chart Authoring Tool feedback",
                designLink: "https://wiki.fluidproject.org/display/fluid/Pie+Chart+Sound+Sketches"
            }
        });
    });
})(jQuery, fluid);
