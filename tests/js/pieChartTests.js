/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.tests.chartAuthoring");

    gpii.tests.chartAuthoring.objectArray = [{
        id: "id0",
        value: 5,
        label: "label 0"
    }, {
        id: "id1",
        value: 10,
        label: "label 1"
    }, {
        id: "id2",
        value: 20,
        label: "label 2"
    }, {
        id: "id3",
        value: 45,
        label: "label 3"
    }];

    fluid.defaults("gpii.tests.chartAuthoring.pieChart", {
        gradeNames: ["gpii.chartAuthoring.pieChart", "autoInit"],
        pieChartOptions: {
            width: 200,
            height: 200,
            colors: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"],
            sort: false
        },
        model: {
            dataSet: gpii.tests.chartAuthoring.objectArray
        }
    });

    gpii.tests.chartAuthoring.testSubcomponent = function (that, subcomponentName, optionsToVerify) {
        jqUnit.assertNotNull("The sub-component \"" + subcomponentName + "\" has been instantiated", that[subcomponentName]);
        jqUnit.assertDeepEq("The model value for \"dataSet\" has been distributed to the sub-component \"" + subcomponentName + "\"", that.model.dataSet, that[subcomponentName].model.dataSet);

        fluid.each(optionsToVerify, function (option) {
            var value = fluid.get(that, [subcomponentName, "options", subcomponentName + "Options", option.name]);
            jqUnit[option.method]("The option \"" + option.name + "\" for creating " + subcomponentName + " has been distributed to the sub-component \"" + subcomponentName + "\"", that.options.pieChartOptions[option.name], value);
        });

        // Verify colors
        for (var i = 0; i < that.options.pieChartOptions.colors.length; i++) {
            var colorScale = fluid.get(that, [subcomponentName, "options", subcomponentName + "Options", "colors"]);
            jqUnit.assertEquals("The color scale function returns correct color code at index " + i, that.options.pieChartOptions.colors[i], colorScale(i));
        }
    };

    gpii.tests.chartAuthoring.testPieChart = function (that) {
        var optionsToVerify = [{
            name: "width",
            method: "assertEquals"
        }, {
            name: "height",
            method: "assertEquals"
        }, {
            name: "sort",
            method: "assertFalse"
        }];

        gpii.tests.chartAuthoring.testSubcomponent(that, "pie", optionsToVerify);
        gpii.tests.chartAuthoring.testSubcomponent(that, "legend", optionsToVerify);

        jqUnit.start();
    };

    jqUnit.asyncTest("Test the pie chart", function () {
        jqUnit.expect(22);

        gpii.tests.chartAuthoring.pieChart(".gpiic-ca-pieChart", {
            listeners: {
                "onPieChartReady.runTest": "gpii.tests.chartAuthoring.testPieChart"
            },
            resources: {
                template: {
                    resourceText: "<div class=\"gpiic-ca-pieChart-pie\"></div><div class=\"gpiic-ca-pieChart-legend\"></div>"
                }
            }
        });
    });

})(jQuery, fluid);
