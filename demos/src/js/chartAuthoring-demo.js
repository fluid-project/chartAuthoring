var demo = demo || {};

/*

Potential demo color stacks:

Grey Scale: colors: ["#979798", "#bbbdc0", "#58585b", "#e6e7e8", "#231f20"]
Green: colors: ["#00a59a", "#9bc863", "#1a6b61", "#e9ea7b", "#1b443d"]
Blue: colors: ["#04ca6dc", "#65cdf5", "#546ab2", "#b6e2ec", "#20386c"]
Red: colors: ["#f15e4e", "#faa634", "#a41c3f", "#fde95f", "#5b173b"]
Varied#1: colors: ["#04858d", "#41beae", "#faa634", "#f15e4e", "#004861"]
Varied#2: colors: ["#f7961c", "#87acdb", "#ffc60a", "#a2ce5a", "#f15e4e"]
Varied#3: colors: ["#f15e4e", "#acdee4", "#73c163", "#ffc74a", "#41beae"]

*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.chartAuthoring.demo");

    floe.chartAuthoring.demo.addExampleData = function (that) {
        var initialData = that.options.initialData;
        var dataEntries = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntry");
        var dataEntryLabelSelector = that.chartAuthoringInterface.dataEntryPanel.dataEntry.options.selectors.label;
        var dataEntryValueSelector = that.chartAuthoringInterface.dataEntryPanel.dataEntry.options.selectors.value;

        var initialDataLength = initialData.data.length;
        var dataEntriesToUpdate = dataEntries.slice(0, initialDataLength);

        dataEntriesToUpdate.each(function(idx) {
            var currentEntry = $(this);
            var sampleData = initialData.data[idx];
            currentEntry.find(dataEntryLabelSelector).val(sampleData.label).trigger("change");
            currentEntry.find(dataEntryValueSelector).val(sampleData.value).trigger("change");
        });

    };


    fluid.defaults("floe.chartAuthoring.demo", {
        gradeNames: ["floe.chartAuthoring"],
        listeners: {
            "onToolReady.addExampleInput": {
                funcName: "floe.chartAuthoring.demo.addExampleData",
                args: ["{that}"]
            }
        },
        initialData: {
            data:
                [{
                    label: "Value #1",
                    value: 75
                },
                {
                    label: "Value #2",
                    value: 17
                },
                {
                    label: "Value #3",
                    value: 33
                }]
            }
        });
})(jQuery,fluid);
