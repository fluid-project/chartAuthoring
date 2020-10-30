/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* global fluid, floe */

(function ($, fluid) {

    "use strict";

    fluid.defaults("floe.chartAuthoring.dataEntryPanel", {
        gradeNames: ["floe.chartAuthoring.totalRelaying", "floe.chartAuthoring.templateInjection"],
        selectors: {
            dataEntryForm: ".floec-ca-dataEntryPanel-dataEntryForm",
            dataEntryLabel: ".floec-ca-dataEntryPanel-dataEntryLabel",
            dataEntries: ".floec-ca-dataEntryPanel-dataEntries",
            dataEntry: ".floec-ca-dataEntryPanel-dataEntry",
            totalValue: ".floec-ca-dataEntryPanel-totalValue",
            totalPercentage: ".floec-ca-dataEntryPanel-totalPercentage",
            totalLabel: ".floec-ca-dataEntryPanel-totalLabel",
            resetButton: ".floec-ca-dataEntryPanel-resetButton"
        },
        strings: {
            dataEntryLabel: "Enter your labels and values",
            emptyTotalValue: "Value",
            totalPercentage: "%percentage%",
            totalLabel: "Total"
        },
        dynamicComponents: {
            dataEntry: {
                createOnEvent: "createDataEntryField",
                type: "floe.chartAuthoring.dataEntry",
                container: "{arguments}.0",
                options: {
                    gradeNames: ["{that}.generateModelRelaysConnectionGrade"],
                    invokers: {
                        "generateModelRelaysConnectionGrade": {
                            funcName: "floe.chartAuthoring.dataEntryPanel.generateModelRelaysConnectionGrade",
                            args: ["{that}.nickName", "{that}.id", ["dataEntries"]]
                        }
                    },
                    resources: {
                        template: "{dataEntryPanel}.options.resources.dataEntry"
                    }
                }
            }
        },
        model: {
            total: {
                // value: number,
                // percentage: number
            },
            dataSet: {
                // "dataEntryComponent-uuid": {}
            }
        },
        numDataEntryFields: 5,
        events: {
            createDataEntryField: null
        },
        listeners: {
            "onCreate.renderPanel": "floe.chartAuthoring.dataEntryPanel.renderPanel"
        },
        modelListeners: {
            "total": {
                listener: "floe.chartAuthoring.dataEntryPanel.renderTotals",
                args: ["{that}"]
            }
        },
        resources: {
            template: {},
            dataEntry: {}
        }
    });

    floe.chartAuthoring.dataEntryPanel.generateModelRelaysConnectionGrade = function (nickName, id) {
        var gradeName = "floe.chartAuthoring.dataEntryPanel.modelRelayConnections." + fluid.allocateGuid();
        var modelPathBase = "{dataEntryPanel}.model.dataSet." + nickName + "-" + id + ".";

        fluid.defaults(gradeName, {
            model: {
                value: modelPathBase + "value",
                percentage: modelPathBase + "percentage",
                label: modelPathBase + "label"
            },
            modelRelay: {
                source: "{dataEntryPanel}.model.total.value",
                target: "total",
                backward: "never",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        });

        return gradeName;
    };

    floe.chartAuthoring.dataEntryPanel.append = function (container, template) {
        template = $(template).clone();
        container.append(template);
        return template;
    };

    floe.chartAuthoring.dataEntryPanel.renderPanel = function (that) {
        that.locate("dataEntryLabel").text(that.options.strings.dataEntryLabel);
        var totalLabel = that.locate("totalLabel");
        totalLabel.text(that.options.strings.totalLabel);

        // Allocate ID to total label
        var totalLabelId = fluid.allocateSimpleId(totalLabel);

        // Connect total label and displayed total via aria-labelledby,
        // indicate displayed total is a live region
        var totalValue = that.locate("totalValue");
        totalValue.attr({
            "aria-labelledby": totalLabelId,
            "aria-live": "polite"
        });

        var dataEntryContainerTemplate = that.locate("dataEntry").remove();
        for (var i = 1; i <= that.options.numDataEntryFields; i++) {
            var deCont = floe.chartAuthoring.dataEntryPanel.append(that.locate("dataEntries"), dataEntryContainerTemplate);
            that.events.createDataEntryField.fire(deCont);
        }

    };

    floe.chartAuthoring.dataEntryPanel.renderTotals = function (that) {
        var percentage, totalToRender;
        var total = that.model.total.value;

        if (fluid.isValue(total)) {
            percentage = that.model.total.percentage;
            totalToRender = total;
        } else {
            percentage = "";
            totalToRender = that.options.strings.emptyTotalValue;
        }

        that.locate("totalValue").text(totalToRender);
        floe.chartAuthoring.percentage.render(that.locate("totalPercentage"), percentage, that.options.strings.totalPercentage);
    };

})(jQuery, fluid);
