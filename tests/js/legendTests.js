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
        legendOptions: {
            width: 200,
            height: 200,
            colors: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"]
        },
        listeners: {
            "onLegendCreated.addMouseoverListener": {
                listener: "{that}.addD3Listeners",
                args: ["{that}.dom.row", "mouseover", "gpii.tests.chartAuthoring.mouseOverListener"]
            }
        }
    });

    gpii.tests.chartAuthoring.mouseOverListener = function (data, i, that) {
        // that.mouseOverListenerCalled = true;
    };

    gpii.tests.chartAuthoring.objectArray = [{
        id: "id0",
        value: 15,
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

    gpii.tests.chartAuthoring.objectArrayAdd = [{
        id: "id0",
        value: 15,
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
    },
    {
        id: "id4",
        value: 26,
        label: "Five"
    }
  ];

  gpii.tests.chartAuthoring.objectArrayRemove = [{
      id: "id0",
      value: 15,
      label: "One"
  }, {
      id: "id1",
      value: 10,
      label: "Two"
  }, {
      id: "id2",
      value: 20,
      label: "Three"
  }
];

    jqUnit.test("Test the legend component created based off an array of objects", function () {
        jqUnit.expect(0);

        var that = gpii.tests.chartAuthoring.pieChart.legend(".gpii-ca-legend-objects", {
            model: {
                dataSet: gpii.tests.chartAuthoring.objectArray
            }
        });
        setTimeout(function() {
          that.applier.change("dataSet", gpii.tests.chartAuthoring.objectArrayAdd);
        }, 3000);
        setTimeout(function() {
          that.applier.change("dataSet", gpii.tests.chartAuthoring.objectArrayRemove);
        }, 6000);

        // console.log(that);
    });

})(jQuery, fluid);
