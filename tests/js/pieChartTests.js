/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.tests.chartAuthoring");

    floe.tests.chartAuthoring.objectArray = [{
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

    fluid.defaults("floe.tests.chartAuthoring.pieChart", {
        gradeNames: ["floe.chartAuthoring.pieChart", "autoInit"],
        svgOptions: {
            width: 200,
            height: 200
        },
        pieChartOptions: {
            colors: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"],
            sort: false
        },
        model: {
            dataSet: floe.tests.chartAuthoring.objectArray
        }
    });

    floe.tests.chartAuthoring.testSubcomponent = function (that, subcomponentName, optionsToVerify) {
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

    floe.tests.chartAuthoring.testPieChart = function (that) {
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

        floe.tests.chartAuthoring.testSubcomponent(that, "pie", optionsToVerify);
        floe.tests.chartAuthoring.testSubcomponent(that, "legend", optionsToVerify);

        jqUnit.start();
    };

    jqUnit.asyncTest("Test the pie chart", function () {
        jqUnit.expect(22);

        floe.tests.chartAuthoring.pieChart(".floec-ca-pieChart", {
            listeners: {
                "onPieChartReady.runTest": "floe.tests.chartAuthoring.testPieChart"
            },
            resources: {
                template: {
                    resourceText: "<div class=\"floec-ca-pieChart-pie\"></div><div class=\"floec-ca-pieChart-legend\"></div>"
                }
            }
        });
    });

})(jQuery, fluid);
