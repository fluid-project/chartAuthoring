/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    /*

    <h2 class="gpiic-ca-dataEntryPanel-title">Panel Title</h2>
    <p class="gpiic-ca-dataEntryPanel-description">Description</p>
    <form>
        <label class="gpiic-ca-dataEntryPanel-nameLabel", for="gpiic-ca-dataEntryPanel-name">Chart name label</label><span>:</span>
        <input id="gpiic-ca-dataEntryPanel-name" class="gpiic-ca-dataEntryPanel-name" type="text" placeholder="">
        <fieldset>
            <legend class="gpiic-ca-dataEntryPanel-dataEntryLabel">Entry</legend>
            <ul>
                <li class="gpiic-ca-dataEntryPanel-dataEntry"></li>
            </ul>
            <span class="gpiic-ca-dataEntryPanel-totalValue">Value</span>
            <span class="gpiic-ca-dataEntryPanel-totalPercentage">%</span>
            <span class="gpiic-ca-dataEntryPanel-totalLabel">Total</span>
        </fieldset>
    </form>

    */

    fluid.defaults("gpii.chartAuthoring.dataEntryPanel", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        selectors: {
            panelTitle: ".gpiic-ca-dataEntryPanel-title",
            description: ".gpiic-ca-dataEntryPanel-description",
            chartNameLabel: ".gpiic-ca-dataEntryPanel-nameLabel",
            chartName: ".gpiic-ca-dataEntryPanel-name",
            dataEntryLabel: ".gpiic-ca-dataEntryPanel-dataEntryLabel",
            dataEntries: ".gpiic-ca-dataEntryPanel-dataEntries",
            dataEntry: ".gpiic-ca-dataEntryPanel-dataEntry",
            totalValue: ".gpiic-ca-dataEntryPanel-totalValue",
            totalPercentage: ".gpiic-ca-dataEntryPanel-totalPercentage",
            totalLabel: ".gpiic-ca-dataEntryPanel-totalLabel"
        },
        strings: {
            panelTitle: "Data Entry",
            description: "<p><strong>Welcome!</strong></p> <p>In order to create your chart, you first need to enter your values. If you enter numeric values, the percentage will be calculated automatically for you. If you enter percentages, there is no need to add any other value. Note that the total percentage must be equal 100%.</p>",
            chartNameLabel: "Name your chart",
            chartNamePlacholder: "Name (max of 30 characters)",
            dataEntryLabel: "Enter your values",
            emptyTotalValue: "Value",
            totalPercentage: "%percentage%",
            totalLabel: "Total"
        },
        members: {
            dataEntryContainerTemplate: {
                expander: {
                    "this": "{that}.dom.dataEntry",
                    "method": "remove"
                }
            }
        },
        model: {
            total: {
                // total: number,
                // percentage: number
            },
            dataEntries: {
                // "uuid": {
                //
                // }
            }
        },
        // TODO: add a model relay for summing data entries.
        modelRelay: [{
            source: "dataEntries",
            target: "total.value",
            singleTransform: {
                type: "fluid.transforms.free",
                args: ["{that}.model.dataEntries"],
                func: "gpii.chartAuthoring.dataEntryPanel.sumDataEntries"
            }
        }, {
            source: "total.value",
            target: "total.percentage",
            singleTransform: {
                type: "fluid.transforms.free",
                args: [
                    "{that}.model.total.value",
                    "{that}.model.total.value"
                ],
                func: "gpii.chartAuthoring.percentage.calculate"
            }
        }],
        numDataEntryFields: 5,
        chartNameMaxLength: 30,
        events: {
            createDataEntryField: null
        },
        listeners: {
            "onCreate.renderPanel": "gpii.chartAuthoring.dataEntryPanel.renderPanel",
            "createDataEntryField.appendContainer": {
                funcName: "gpii.chartAuthoring.dataEntryPanel.append",
                args: ["{that}.dom.dataEntries", "{that}.dataEntryContainerTemplate"],
                "priority": "first"
            }
        },
        modelListeners: {
            "total": {
                listener: "gpii.chartAuthoring.dataEntryPanel.renderTotals",
                args: ["{that}"]
            }
        }
    });

    gpii.chartAuthoring.dataEntryPanel.append = function (container, template) {
        template = $(template).clone();
        container.append(template);
    };

    gpii.chartAuthoring.dataEntryPanel.renderPanel = function (that) {
        that.locate("panelTitle").text(that.options.strings.panelTitle);
        that.locate("description").html(that.options.strings.description);
        that.locate("chartNameLabel").text(that.options.strings.chartNameLabel);

        var chartName = that.locate("chartName");
        chartName.attr({
            placeholder: that.options.strings.chartNamePlacholder,
            maxlength: that.options.chartNameMaxLength,
            size: Math.max(that.options.strings.chartNamePlacholder.length, that.options.chartNameMaxLength)
        });

        that.locate("dataEntryLabel").text(that.options.strings.dataEntryLabel);
        that.locate("totalLabel").text(that.options.strings.totalLabel);

        for (var i = 1; i <= that.options.numDataEntryFields; i++) {
            that.events.createDataEntryField.fire();
        }
    };

    gpii.chartAuthoring.dataEntryPanel.renderTotals = function (that) {
        var totalToRender = gpii.chartAuthoring.percentage.percentageIfValue(that.model.total.value, that.model.total.value, that.options.strings.emptyTotalValue);
        that.locate("totalValue").text(totalToRender);

        var percentage = gpii.chartAuthoring.percentage.percentageIfValue(that.model.total.percentage, that.model.total.value, "");
        gpii.chartAuthoring.percentage.render(that.locate("totalPercentage"), percentage, that.options.strings.totalPercentage);
    };

    gpii.chartAuthoring.dataEntryPanel.sumDataEntries = function (dataEntries) {
        var entryKeys = fluid.keys(dataEntries);

        return fluid.accumulate(entryKeys, function (entryKey, currentValue) {
            var valToAdd = parseFloat(dataEntries[entryKey].value);

            if (fluid.isValue(valToAdd) && !isNaN(valToAdd)) {
                return valToAdd + (currentValue || 0);
            } else {
                return currentValue;
            }
        });
    };

})(jQuery, fluid);
