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
            colors: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"]
        },
        listeners: {
            "onLegendCreated.addMouseoverListener": {
                listener: "{that}.addD3Listeners",
                args: ["{that}.dom.row", "mouseover", "gpii.tests.chartAuthoring.mouseOverListener"]
            }
        },
        members: {
            mouseOverListenerCalled: false
        }
    });

    gpii.tests.chartAuthoring.objectArray = [{
        id: "id0",
        value: 15,
        label: "One"
    }, {
        id: "id1",
        value: 67,
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
        value: 67,
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
    }];

    gpii.tests.chartAuthoring.objectArrayRemove = [{
        id: "id0",
        value: 15,
        label: "One"
    }, {
        id: "id1",
        value: 67,
        label: "Two"
    }, {
        id: "id2",
        value: 20,
        label: "Three"
    }];

    gpii.tests.chartAuthoring.objectArrayChangeInPlace = [{
        id: "id0",
        value: 36,
        label: "I"
    }, {
        id: "id1",
        value: 67,
        label: "II"
    }, {
        id: "id2",
        value: 26,
        label: "Three"
    }];

    gpii.tests.chartAuthoring.objectArraySorted = [{
        id: "id1",
        value: 67,
        label: "Two"
    }, {
        id: "id3",
        value: 45,
        label: "Four"
    },
    {
        id: "id2",
        value: 20,
        label: "Three"
    }, {
        id: "id0",
        value: 15,
        label: "One"
    }];

    gpii.tests.chartAuthoring.objectArrayAddSorted = [{
        id: "id1",
        value: 67,
        label: "Two"
    }, {
        id: "id3",
        value: 45,
        label: "Four"
    },
    {
        id: "id4",
        value: 26,
        label: "Five"
    },
    {
        id: "id2",
        value: 20,
        label: "Three"
    }, {
        id: "id0",
        value: 15,
        label: "One"
    }];

    gpii.tests.chartAuthoring.objectArrayRemoveSorted = [{
        id: "id1",
        value: 67,
        label: "Two"
    },
    {
        id: "id2",
        value: 20,
        label: "Three"
    }, {
        id: "id0",
        value: 15,
        label: "One"
    }];

    gpii.tests.chartAuthoring.objectArrayChangeInPlaceSorted = [{
        id: "id1",
        value: 67,
        label: "II"
    }, {
        id: "id0",
        value: 36,
        label: "I"
    }, {
        id: "id2",
        value: 26,
        label: "Three"
    }];

    gpii.tests.chartAuthoring.mouseOverListener = function (data, i, that) {
        that.mouseOverListenerCalled = true;
    };

    // convenience function for easing testing of colors (jquery returns only RGB)
    // Based off http://stackoverflow.com/questions/4262417/jquery-hex-to-rgb-calculation-different-between-browsers
    gpii.tests.chartAuthoring.hexToRGB = function (hexStr){
        // note: hexStr should be #rrggbb
        var hex = parseInt(hexStr.substring(1), 16);
        var r = (hex & 0xff0000) >> 16;
        var g = (hex & 0x00ff00) >> 8;
        var b = hex & 0x0000ff;
        return "rgb(" + r + ", " + g + ", " + b + ")";
    };

    gpii.tests.chartAuthoring.testLegendSyncWithModelDataSet = function(that, expectedDataSet) {
        var dataSet = expectedDataSet;

        var rows = gpii.d3.jQueryToD3(that.locate("row"));
        rows.each(function (d,i) {
            var displayedLabel = d3.select(this).select("."+that.classes.labelCell).text();
            var expectedLabel = dataSet[i].label;
            var displayedValue = d3.select(this).select("."+that.classes.valueCell).text();
            var expectedValue = dataSet[i].value;
            jqUnit.assertEquals("Displayed labels are in sync with the current model's labels", expectedLabel, displayedLabel);
            jqUnit.assertEquals("Displayed values are in sync with the current model's values", expectedValue, displayedValue);
        });
    };

    gpii.tests.chartAuthoring.testMouseOverListener = function (that) {
        jqUnit.assertFalse("The mouseover listener for legend rows has not been triggered", that.mouseOverListenerCalled);
        var oneD3Row = that.jQueryToD3($(that.locate("row")[0]));
        oneD3Row.on("mouseover")();
        jqUnit.assertTrue("The mouseover listener for legend rows has been triggered", that.mouseOverListenerCalled);
    };

    gpii.tests.chartAuthoring.validateLegend = function (that, expectedDataSet) {
        var table = that.locate("table");

        // Test the legend creation
        jqUnit.assertNotEquals("The TABLE element for the legend is created with the proper selector", 0, table.length);

        jqUnit.assertEquals("A TR element has been created for each value in the dataset, with proper selectors", that.model.dataSet.length, that.locate("row").length);

        var d3ColorCells = that.jQueryToD3($(that.locate("legendColorCell")));
        d3ColorCells.each(function (d) {

            jqUnit.assertEquals("The data colors are filled correctly in the legend", gpii.tests.chartAuthoring.hexToRGB(d.color), ($(this).css("background-color")));
        });

        var d3LabelCells = that.jQueryToD3($(that.locate("labelCell")));
        d3LabelCells.each(function (d) {
            jqUnit.assertEquals("The data labels are applied correctly in the legend", d.label, ($(this).html()));
        });

        var d3ValueCells = that.jQueryToD3($(that.locate("valueCell")));

        d3ValueCells.each(function (d) {
            jqUnit.assertEquals("The data values are applied correctly in the legend", d.value, ($(this).html()));
        });

        gpii.tests.chartAuthoring.testLegendSyncWithModelDataSet(that, expectedDataSet);

    };

    gpii.tests.chartAuthoring.testLegend = function (that, objectArray, objectArrayAdd, objectArrayRemove, objectArrayChangeInPlace) {

        // Legend is created from dataset

        gpii.tests.chartAuthoring.validateLegend(that, objectArray);

        gpii.tests.chartAuthoring.testMouseOverListener(that);

        // Legend is redrawn when data set changes

        // Item added to dataset

        that.applier.change("dataSet", gpii.tests.chartAuthoring.objectArrayAdd);
        gpii.tests.chartAuthoring.validateLegend(that, objectArrayAdd);

        // Item removed from dataset

        that.applier.change("dataSet", gpii.tests.chartAuthoring.objectArrayRemove);
        gpii.tests.chartAuthoring.validateLegend(that, objectArrayRemove);

        // Items changed in place

        that.applier.change("dataSet", gpii.tests.chartAuthoring.objectArrayChangeInPlace);
        gpii.tests.chartAuthoring.validateLegend(that, objectArrayChangeInPlace);

    };

    jqUnit.test("Test the legend component created based off an array of objects, unsorted", function () {
        jqUnit.expect(85);

        var that = gpii.tests.chartAuthoring.pieChart.legend(".gpii-ca-legend-objects-unsorted", {
            model: {
                dataSet: gpii.tests.chartAuthoring.objectArray
            },
            legendOptions: {
                sort:false
            }
        });

        gpii.tests.chartAuthoring.testLegend(that, gpii.tests.chartAuthoring.objectArray, gpii.tests.chartAuthoring.objectArrayAdd, gpii.tests.chartAuthoring.objectArrayRemove, gpii.tests.chartAuthoring.objectArrayChangeInPlace);

    });

    jqUnit.test("Test the legend component created based off an array of objects, sorted", function () {
        jqUnit.expect(85);

        var that = gpii.tests.chartAuthoring.pieChart.legend(".gpii-ca-legend-objects-sorted", {
            model: {
                dataSet: gpii.tests.chartAuthoring.objectArray
            },
            legendOptions: {
                sort:true
            }
        });

        gpii.tests.chartAuthoring.testLegend(that, gpii.tests.chartAuthoring.objectArraySorted, gpii.tests.chartAuthoring.objectArrayAddSorted, gpii.tests.chartAuthoring.objectArrayRemoveSorted, gpii.tests.chartAuthoring.objectArrayChangeInPlaceSorted);

    });


})(jQuery, fluid);
