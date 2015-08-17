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

    fluid.defaults("gpii.tests.chartAuthoring.pieChart.legend", {
        gradeNames: ["gpii.chartAuthoring.pieChart.legend", "autoInit"],
        pieOptions: {
            width: 200,
            height: 200,
            colors: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"]
        }
    });

    gpii.tests.chartAuthoring.numberArray = [17,8,11,23];

    gpii.tests.chartAuthoring.objectArray = [{
        id: "id0",
        value: 5,
        label: "One"
    }, {
        id: "id1",
        value: 10,
        label: "Two"
    }, {
        id: "id2",
        value: 20,
        label: "Three"
    }, {
        id: "id3",
        value: 45,
        label: "Four"
    }];

    jqUnit.test("Test the legend component created based off an array of numbers", function () {
        jqUnit.expect(0);

        var that = gpii.tests.chartAuthoring.pieChart.legend(".gpii-ca-legend-numbers", {
            model: {
                dataSet: gpii.tests.chartAuthoring.numberArray
            }
        });
        // console.log(that);
    });


    jqUnit.test("Test the legend component created based off an array of objects", function () {
        jqUnit.expect(0);

        var that = gpii.tests.chartAuthoring.pieChart.legend(".gpii-ca-legend-objects", {
            model: {
                dataSet: gpii.tests.chartAuthoring.objectArray
            }
        });
        // console.log(that);
    });

})(jQuery, fluid);
