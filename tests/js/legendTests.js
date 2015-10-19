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
        },
        strings: {
            legendTitle: "Legend Title"
        }
    });

    floe.tests.chartAuthoring.objectArray = [{
        id: "id0",
        value: 15,
        label: "One",
        color: "#000000"
    }, {
        id: "id1",
        value: 67,
        label: "Two",
        color: "#ff0000"
    }, {
        id: "id2",
        value: 20,
        label: "Three",
        color: "#00ff00"
    }, {
        id: "id3",
        value: 45,
        label: "Four",
        color:  "#0000ff"
    }];

    floe.tests.chartAuthoring.objectArrayAdd = [{
        id: "id0",
        value: 15,
        label: "One",
        color: "#000000"
    }, {
        id: "id1",
        value: 67,
        label: "Two",
        color: "#ff0000"
    }, {
        id: "id2",
        value: 20,
        label: "Three",
        color: "#00ff00"
    }, {
        id: "id3",
        value: 45,
        label: "Four",
        color:  "#0000ff"
    },
    {
        id: "id4",
        value: 26,
        label: "Five",
        color: "#aabbcc"
    }];

    floe.tests.chartAuthoring.objectArrayRemove = [{
        id: "id0",
        value: 15,
        label: "One",
        color: "#000000"
    }, {
        id: "id1",
        value: 67,
        label: "Two",
        color: "#ff0000"
    }, {
        id: "id2",
        value: 20,
        label: "Three",
        color: "#00ff00"
    }];

    floe.tests.chartAuthoring.objectArrayChangeInPlace = [{
        id: "id0",
        value: 36,
        label: "I",
        color: "#000000"
    }, {
        id: "id1",
        value: 67,
        label: "II",
        color: "#ff0000"
    }, {
        id: "id2",
        value: 26,
        label: "Three",
        color: "#00ff00"
    }];

    floe.tests.chartAuthoring.objectArraySorted = [{
        id: "id1",
        value: 67,
        label: "Two",
        color: "#ff7f0e"
    }, {
        id: "id3",
        value: 45,
        label: "Four",
        color: "#d62728"
    },
    {
        id: "id2",
        value: 20,
        label: "Three",
        color: "#2ca02c"
    }, {
        id: "id0",
        value: 15,
        label: "One",
        color: "#1f77b4"
    }];

    floe.tests.chartAuthoring.objectArrayAddSorted = [{
        id: "id1",
        value: 67,
        label: "Two",
        color: "#ff7f0e"
    }, {
        id: "id3",
        value: 45,
        label: "Four",
        color: "#d62728"
    },
    {
        id: "id4",
        value: 26,
        label: "Five",
        color: "#9467bd"
    },
    {
        id: "id2",
        value: 20,
        label: "Three",
        color: "#2ca02c"
    }, {
        id: "id0",
        value: 15,
        label: "One",
        color: "#1f77b4"
    }];

    floe.tests.chartAuthoring.objectArrayRemoveSorted = [{
        id: "id1",
        value: 67,
        label: "Two",
        color: "#ff7f0e"
    },
    {
        id: "id2",
        value: 20,
        label: "Three",
        color: "#2ca02c"
    }, {
        id: "id0",
        value: 15,
        label: "One",
        color: "#1f77b4"
    }];

    floe.tests.chartAuthoring.objectArrayChangeInPlaceSorted = [{
        id: "id1",
        value: 67,
        label: "II",
        color: "#ff7f0e"
    }, {
        id: "id0",
        value: 36,
        label: "I",
        color: "#1f77b4"
    }, {
        id: "id2",
        value: 26,
        label: "Three",
        color: "#2ca02c"
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
            var displayedColor = d3.select(this).select(that.options.selectors.colorCell).style("background-color"),
                expectedColor = dataSet[i].color,
                displayedLabel = d3.select(this).select(that.options.selectors.labelCell).text(),
                expectedLabel = dataSet[i].label,
                displayedValue = d3.select(this).select(that.options.selectors.valueCell).text(),
                expectedValue = dataSet[i].value;

            jqUnit.assertEquals("Displayed colors are in sync with the current model's colors", displayedColor, floe.tests.chartAuthoring.hexToRGB(expectedColor));
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

        jqUnit.assertEquals("The legend's title is applied as a caption", that.options.strings.legendTitle, that.locate("caption").text());

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
        jqUnit.expect(104);

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
        jqUnit.expect(104);

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
