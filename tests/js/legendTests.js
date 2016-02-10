/*
Copyright 2015-2016 OCAD University

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

    floe.tests.chartAuthoring.objectArrayTotal = 147;

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

    floe.tests.chartAuthoring.objectArrayAddTotal = 173;

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

    floe.tests.chartAuthoring.objectArrayRemoveTotal = 102;

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

    floe.tests.chartAuthoring.objectArrayChangeInPlaceTotal = 129;

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

    floe.tests.chartAuthoring.objectArrayForCustomDisplay = [{
        id: "custom1",
        value: 65,
        label: "Label One",
        color: "#ff7f0e"
    }, {
        id: "custom2",
        value: 35,
        label: "Label Two",
        color: "#1f77b4"
    }];

    floe.tests.chartAuthoring.expectedCustomDisplay = [{
        expectedValue: "65 (out of 100)",
        expectedLabel: "Label One (65%)"
    }, {
        expectedValue: "35 (out of 100)",
        expectedLabel: "Label Two (35%)"
    }];

    floe.tests.chartAuthoring.mouseOverListener = function (data, i, that) {
        that.mouseOverListenerCalled = true;
    };

    // convenience function for easing testing of colors (jquery returns only RGB)
    // Based off http://stackoverflow.com/questions/4262417/jquery-hex-to-rgb-calculation-different-between-browsers
    floe.tests.chartAuthoring.hexToRGB = function (hexStr) {
        // note: hexStr should be #rrggbb
        var hex = parseInt(hexStr.substring(1), 16);
        var r = (hex & 0xff0000) >> 16;
        var g = (hex & 0x00ff00) >> 8;
        var b = hex & 0x0000ff;
        return "rgb(" + r + ", " + g + ", " + b + ")";
    };

    floe.tests.chartAuthoring.testLegendSyncWithModelDataSet = function (that, expectedDataSet) {
        var dataSet = expectedDataSet;
        var rows = floe.d3.jQueryToD3(that.locate("row"));
        rows.each(function (d, i) {
            var displayedColor = d3.select(this).select(that.options.selectors.colorCell).style("background-color"),
                expectedColor = dataSet[i].color,
                displayedLabel = d3.select(this).select(that.options.selectors.labelCell).text(),
                expectedLabel = dataSet[i].label,
                displayedValue = d3.select(this).select(that.options.selectors.valueCell).text(),
                expectedValue = dataSet[i].value;

            jqUnit.assertEquals("Displayed colors are in sync with the current model's colors", displayedColor, floe.tests.chartAuthoring.hexToRGB(expectedColor));
            jqUnit.assertEquals("Displayed labels are in sync with the current model's labels", expectedLabel, displayedLabel);
            // Coerce displayedValue to number for comparison with model value
            jqUnit.assertEquals("Displayed values are in sync with the current model's values", expectedValue, Number(displayedValue));
        });
    };

    floe.tests.chartAuthoring.testMouseOverListener = function (that) {
        jqUnit.assertFalse("The mouseover listener for legend rows has not been triggered", that.mouseOverListenerCalled);
        var oneD3Row = that.jQueryToD3($(that.locate("row")[0]));
        oneD3Row.on("mouseover")();
        jqUnit.assertTrue("The mouseover listener for legend rows has been triggered", that.mouseOverListenerCalled);
    };

    floe.tests.chartAuthoring.validateLegend = function (that, expectedDataSet, expectedTotalValue) {
        var table = that.locate("table");

        // Test the legend creation
        jqUnit.assertNotEquals("The TABLE element for the legend is created with the proper selector", 0, table.length);

        jqUnit.assertEquals("A TR element has been created for each value in the dataset, with proper selectors", that.model.dataSet.length, that.locate("row").length);

        var d3ColorCells = that.jQueryToD3($(that.locate("colorCell")));
        d3ColorCells.each(function (d) {
            jqUnit.assertEquals("The data colors are filled correctly in the legend", floe.tests.chartAuthoring.hexToRGB(d.color), ($(this).css("background-color")));
            jqUnit.assertEquals("The color cells have role=presentation", "presentation", ($(this).attr("role")));
        });

        var d3LabelCells = that.jQueryToD3($(that.locate("labelCell")));
        d3LabelCells.each(function (d) {
            jqUnit.assertEquals("The data labels are applied correctly in the legend", d.label, ($(this).html()));
        });

        var d3ValueCells = that.jQueryToD3($(that.locate("valueCell")));

        d3ValueCells.each(function (d) {
            // Coerce displayed value to number for comparison with DOM-bound d3 value
            jqUnit.assertEquals("The data values are applied correctly in the legend", d.value, Number(($(this).html())));
        });

        jqUnit.assertEquals("The legend's title is applied as a caption", that.options.strings.legendTitle, that.locate("caption").text());

        jqUnit.assertEquals("The total value is calculated as expected", expectedTotalValue, that.model.total.value);

        floe.tests.chartAuthoring.testLegendSyncWithModelDataSet(that, expectedDataSet);

    };

    floe.tests.chartAuthoring.testLegend = function (that, objectArray, objectArrayAdd, objectArrayRemove, objectArrayChangeInPlace) {

        // Legend is created from dataset

        floe.tests.chartAuthoring.validateLegend(that, objectArray, floe.tests.chartAuthoring.objectArrayTotal);

        floe.tests.chartAuthoring.testMouseOverListener(that);

        // Legend is redrawn when data set changes

        // Item added to dataset

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayAdd);
        floe.tests.chartAuthoring.validateLegend(that, objectArrayAdd, floe.tests.chartAuthoring.objectArrayAddTotal);

        // Item removed from dataset

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayRemove);
        floe.tests.chartAuthoring.validateLegend(that, objectArrayRemove, floe.tests.chartAuthoring.objectArrayRemoveTotal);

        // Items changed in place

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayChangeInPlace);
        floe.tests.chartAuthoring.validateLegend(that, objectArrayChangeInPlace, floe.tests.chartAuthoring.objectArrayChangeInPlaceTotal);

    };

    jqUnit.test("Test the legend component created based off an array of objects, unsorted, user-supplied colours", function () {
        jqUnit.expect(123);

        var that = floe.tests.chartAuthoring.pieChart.legend(".floe-ca-legend-objects-unsorted", {
            model: {
                dataSet: floe.tests.chartAuthoring.objectArray
            },
            legendOptions: {
                sort: false
            }
        });

        floe.tests.chartAuthoring.testLegend(that, floe.tests.chartAuthoring.objectArray, floe.tests.chartAuthoring.objectArrayAdd, floe.tests.chartAuthoring.objectArrayRemove, floe.tests.chartAuthoring.objectArrayChangeInPlace);

    });

    jqUnit.test("Test the legend component created based off an array of objects, sorted, default colours", function () {
        jqUnit.expect(123);

        var that = floe.tests.chartAuthoring.pieChart.legend(".floe-ca-legend-objects-sorted", {
            model: {
                dataSet: floe.tests.chartAuthoring.objectArray
            },
            legendOptions: {
                sort: true,
                colors: null
            }
        });

        floe.tests.chartAuthoring.testLegend(that, floe.tests.chartAuthoring.objectArraySorted, floe.tests.chartAuthoring.objectArrayAddSorted, floe.tests.chartAuthoring.objectArrayRemoveSorted, floe.tests.chartAuthoring.objectArrayChangeInPlaceSorted);

    });

    floe.tests.chartAuthoring.testCustomDisplay = function (that, message, cellSelector, expectedValuePath) {
        var d3Cells = that.jQueryToD3($(that.locate(cellSelector)));
        d3Cells.each(function (d, i) {
            var expectedLabel = floe.tests.chartAuthoring.expectedCustomDisplay[i][expectedValuePath];
            jqUnit.assertEquals(message, expectedLabel, ($(this).html()));
        });
    };

    jqUnit.test("Test the legend component with custom value and label display templates", function () {
        jqUnit.expect(4);

        var that = floe.tests.chartAuthoring.pieChart.legend(".floe-ca-legend-custom-labels", {
            model: {
                dataSet: floe.tests.chartAuthoring.objectArrayForCustomDisplay
            },
            legendOptions: {
                sort: false,
                colors: null,
                labelTextDisplayTemplate: "%label (%percentage%)",
                valueTextDisplayTemplate: "%value (out of %total)"
            }
        });

        floe.tests.chartAuthoring.testCustomDisplay(that, "The custom labels are applied correctly in the legend", "labelCell", "expectedLabel");

        floe.tests.chartAuthoring.testCustomDisplay(that, "The custom values are applied correctly in the legend", "valueCell", "expectedValue");

    });

    jqUnit.test("Test addValueFromArray function", function () {
        var objectArray = [{name: "Alice"}, {name: "Bob"}];
        var valueArray = ["true", "false"];
        var expectedTransformedArray = [{name: "Alice", trusted: "true"}, {name: "Bob", trusted: "false"}];
        jqUnit.assertDeepEq("addValueFromArray function behaving as expected", expectedTransformedArray, floe.chartAuthoring.pieChart.legend.addValueFromArray(objectArray, valueArray, "trusted"));
    });

})(jQuery, fluid);
