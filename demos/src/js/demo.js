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
        listeners: {
            "onToolReady.addExampleInput": "demo.chartAuthoring.addExampleInput"
        }
    });

    // Add some example input by simulating data entry

    demo.chartAuthoring.randomValue = function () {
        return Math.floor(Math.random() * 75) +25;
    };

    demo.chartAuthoring.addExampleInput = function () {
        var dataEntries = chartAuthoring.chartAuthoringInterface.dataEntryPanel.locate("dataEntries");

        dataEntries.find("input.floec-ca-dataEntry-label")
            .slice(0,3)
            .each(function(index) {
                var position = index+1;
                $(this).val("label " + position).trigger("change");
            });

        dataEntries.find("input.floec-ca-dataEntry-value")
            .slice(0,3)
            .each(function() {
                $(this).val(demo.chartAuthoring.randomValue()).trigger("change");
            });
    };
})(jQuery,fluid);
