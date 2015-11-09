var demo = demo || {};

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
                sliceTextDisplayTemplate: "%percentage%"
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
        labelInputs.trigger("change");

        var valueInputs = dataEntries.find("input.floec-ca-dataEntry-value");

        valueInputs.first().val(60);
        valueInputs.slice(1,2).val(40);
        valueInputs.trigger("change");
    };
})(jQuery,fluid);
