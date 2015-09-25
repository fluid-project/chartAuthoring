/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/floe/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.tests.chartAuthoring");

    fluid.defaults("floe.tests.chartAuthoring.pieChart.legend", {
        gradeNames: ["floe.chartAuthoring.pieChart.legend", "autoInit"],
        legendOptions: {
            colors: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"]
        },
        listeners: {
            "onLegendCreated.addMouseoverListener": {
                listener: "{that}.addD3Listeners",
                args: ["{that}.dom.row", "mouseover", "floe.tests.chartAuthoring.mouseOverListener"]
            }
        },
        members: {
            mouseOverListenerCalled: false
        }
    });

    floe.tests.chartAuthoring.objectArray = [{
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

    floe.tests.chartAuthoring.objectArrayAdd = [{
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

    floe.tests.chartAuthoring.objectArrayRemove = [{
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

    floe.tests.chartAuthoring.objectArrayChangeInPlace = [{
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

    floe.tests.chartAuthoring.objectArraySorted = [{
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

    floe.tests.chartAuthoring.objectArrayAddSorted = [{
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

    floe.tests.chartAuthoring.objectArrayRemoveSorted = [{
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

    floe.tests.chartAuthoring.objectArrayChangeInPlaceSorted = [{
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

    floe.tests.chartAuthoring.mouseOverListener = function (data, i, that) {
        that.mouseOverListenerCalled = true;
    };

    // convenience function for easing testing of colors (jquery returns only RGB)
    // Based off http://stackoverflow.com/questions/4262417/jquery-hex-to-rgb-calculation-different-between-browsers
    floe.tests.chartAuthoring.hexToRGB = function (hexStr){
        // note: hexStr should be #rrggbb
        var hex = parseInt(hexStr.substring(1), 16);
        var r = (hex & 0xff0000) >> 16;
        var g = (hex & 0x00ff00) >> 8;
        var b = hex & 0x0000ff;
        return "rgb(" + r + ", " + g + ", " + b + ")";
    };

    floe.tests.chartAuthoring.testLegendSyncWithModelDataSet = function(that, expectedDataSet) {
        var dataSet = expectedDataSet;

        var rows = floe.d3.jQueryToD3(that.locate("row"));
        rows.each(function (d,i) {
            var displayedLabel = d3.select(this).select(that.options.selectors.labelCell).text();
            var expectedLabel = dataSet[i].label;
            var displayedValue = d3.select(this).select(that.options.selectors.valueCell).text();
            var expectedValue = dataSet[i].value;
            jqUnit.assertEquals("Displayed labels are in sync with the current model's labels", expectedLabel, displayedLabel);
            jqUnit.assertEquals("Displayed values are in sync with the current model's values", expectedValue, displayedValue);
        });
    };

    floe.tests.chartAuthoring.testMouseOverListener = function (that) {
        jqUnit.assertFalse("The mouseover listener for legend rows has not been triggered", that.mouseOverListenerCalled);
        var oneD3Row = that.jQueryToD3($(that.locate("row")[0]));
        oneD3Row.on("mouseover")();
        jqUnit.assertTrue("The mouseover listener for legend rows has been triggered", that.mouseOverListenerCalled);
    };

    floe.tests.chartAuthoring.validateLegend = function (that, expectedDataSet) {
        var table = that.locate("table");

        // Test the legend creation
        jqUnit.assertNotEquals("The TABLE element for the legend is created with the proper selector", 0, table.length);

        jqUnit.assertEquals("A TR element has been created for each value in the dataset, with proper selectors", that.model.dataSet.length, that.locate("row").length);

        var d3ColorCells = that.jQueryToD3($(that.locate("colorCell")));
        d3ColorCells.each(function (d) {

            jqUnit.assertEquals("The data colors are filled correctly in the legend", floe.tests.chartAuthoring.hexToRGB(d.color), ($(this).css("background-color")));
        });

        var d3LabelCells = that.jQueryToD3($(that.locate("labelCell")));
        d3LabelCells.each(function (d) {
            jqUnit.assertEquals("The data labels are applied correctly in the legend", d.label, ($(this).html()));
        });

        var d3ValueCells = that.jQueryToD3($(that.locate("valueCell")));

        d3ValueCells.each(function (d) {
            jqUnit.assertEquals("The data values are applied correctly in the legend", d.value, ($(this).html()));
        });

        floe.tests.chartAuthoring.testLegendSyncWithModelDataSet(that, expectedDataSet);

    };

    floe.tests.chartAuthoring.testLegend = function (that, objectArray, objectArrayAdd, objectArrayRemove, objectArrayChangeInPlace) {

        // Legend is created from dataset

        floe.tests.chartAuthoring.validateLegend(that, objectArray);

        floe.tests.chartAuthoring.testMouseOverListener(that);

        // Legend is redrawn when data set changes

        // Item added to dataset

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayAdd);
        floe.tests.chartAuthoring.validateLegend(that, objectArrayAdd);

        // Item removed from dataset

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayRemove);
        floe.tests.chartAuthoring.validateLegend(that, objectArrayRemove);

        // Items changed in place

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayChangeInPlace);
        floe.tests.chartAuthoring.validateLegend(that, objectArrayChangeInPlace);

    };

    jqUnit.test("Test the legend component created based off an array of objects, unsorted, user-supplied colours", function () {
        jqUnit.expect(85);

        var that = floe.tests.chartAuthoring.pieChart.legend(".floe-ca-legend-objects-unsorted", {
            model: {
                dataSet: floe.tests.chartAuthoring.objectArray
            },
            legendOptions: {
                sort:false
            }
        });

        floe.tests.chartAuthoring.testLegend(that, floe.tests.chartAuthoring.objectArray, floe.tests.chartAuthoring.objectArrayAdd, floe.tests.chartAuthoring.objectArrayRemove, floe.tests.chartAuthoring.objectArrayChangeInPlace);

    });

    jqUnit.test("Test the legend component created based off an array of objects, sorted, default colours", function () {
        jqUnit.expect(85);

        var that = floe.tests.chartAuthoring.pieChart.legend(".floe-ca-legend-objects-sorted", {
            model: {
                dataSet: floe.tests.chartAuthoring.objectArray
            },
            legendOptions: {
                sort:true,
                colors: null
            }
        });

        floe.tests.chartAuthoring.testLegend(that, floe.tests.chartAuthoring.objectArraySorted, floe.tests.chartAuthoring.objectArrayAddSorted, floe.tests.chartAuthoring.objectArrayRemoveSorted, floe.tests.chartAuthoring.objectArrayChangeInPlaceSorted);

    });


})(jQuery, fluid);
