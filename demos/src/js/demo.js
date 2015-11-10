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

    fluid.registerNamespace("demo.chartAuthoring");

    var chartAuthoring = floe.chartAuthoring("#floec-chartAuthoring", {
        templateLoader: {
            terms: {
                templatePrefix: "../src/html"
            }
        },
        dataEntryPanel: {
            strings: {
                dataEntryLabel: "Enter your labels and values"
            }
        },
        pieChart: {
            pieChartOptions: {
                sliceTextDisplayTemplate: "%percentage%",
                labelTextDisplayTemplate: "%label",
                valueTextDisplayTemplate: "%percentage% (%value/%total)",
                colors: ["#00a59a", "#9bc863", "#1a6b61", "#e9ea7b", "#1b443d"],
                width: 400,
                height: 400
            }
        },
        listeners: {
            "onToolReady.addExampleInput": "demo.chartAuthoring.addExampleInput"
        }
    });

    demo.chartAuthoring.addExampleInput = function () {
        var dataEntries = chartAuthoring.chartAuthoringInterface.dataEntryPanel.locate("dataEntries");

        var labelInputs = dataEntries.find("input.floec-ca-dataEntry-label");

        labelInputs.first().val("label 1");
        labelInputs.slice(1,2).val("label 2");
        // labelInputs.slice(2,3).val("label 3");
        // labelInputs.slice(3,4).val("label 4");
        // labelInputs.slice(4,5).val("label 5");
        labelInputs.trigger("change");

        var valueInputs = dataEntries.find("input.floec-ca-dataEntry-value");

        valueInputs.first().val(60);
        valueInputs.slice(1,2).val(40);
        // valueInputs.slice(2,3).val(25);
        // valueInputs.slice(3,4).val(35);
        // valueInputs.slice(4,5).val(30);
        valueInputs.trigger("change");
    };
})(jQuery,fluid);
