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

    fluid.defaults("floe.tests.chartAuthoring.pieChart.pie", {
        gradeNames: ["floe.chartAuthoring.pieChart.pie", "autoInit"],
        svgOptions: {
            width: 300,
            height: 300
        },
        pieOptions: {
            colors: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"]
        },
        model: {
            svgTitle: "A pie chart used in the unit tests.",
            svgDescription: "Description of the pie chart used in the unit tests."
        },
        listeners: {
            "onPieCreated.addMouseoverListener": {
                listener: "{that}.addD3Listeners",
                args: ["{that}.dom.slice", "mouseover", "floe.tests.chartAuthoring.mouseOverListener"]
            }
        },
        members: {
            mouseOverListenerCalled: false
        }
    });

    floe.tests.chartAuthoring.testValueBinding = function (that, modelPath, DOMPath, newValue) {
        that.applier.change(modelPath, newValue);
        jqUnit.assertEquals("DOM element value `" + DOMPath + "` is updated when its corresponding model value at `" + modelPath + " `is changed");
    };

    floe.tests.chartAuthoring.mouseOverListener = function (data, i, that) {
        that.mouseOverListenerCalled = true;
    };

    floe.tests.chartAuthoring.validatePie = function (that, testSliceDataFunc) {
        var pie = that.locate("svg"),
            pieTitleId = that.locate("title").attr("id"),
            pieDescId = that.locate("description").attr("id"),
            pieAriaLabelledByAttr = pie.attr("aria-labelledby");

        // Test the SVG element created
        jqUnit.assertNotEquals("The SVG element is created with the proper selector", 0, pie.length);

        // Test the background circle
        if (that.options.pieOptions.displayPieBackground) {
            var pieBackground = that.locate("background");
            jqUnit.assertNotEquals("The background circle is created", 0, pieBackground.length);
            jqUnit.assertEquals("The background circle's radius is half the pie width", that.options.svgOptions.width / 2, Number(pieBackground.attr("r")));
            jqUnit.assertEquals("The background circle's color is set to the user-supplied color", that.options.pieOptions.pieBackgroundColor, pieBackground.attr("fill"));
        }

        // Test the pie
        jqUnit.assertEquals("The width is set correctly on the pie chart", that.options.svgOptions.width, Number(pie.attr("width")));
        jqUnit.assertEquals("The height is set correctly on the pie chart", that.options.svgOptions.height, Number(pie.attr("height")));
        jqUnit.assertEquals("The pie slices have been created with the proper selectors", that.model.dataSet.length, that.locate("slice").length);
        jqUnit.assertEquals("The texts for pie slices have been created with the proper selectors", that.model.dataSet.length, that.locate("text").length);
        jqUnit.assertEquals("The pie's title has been created", that.model.svgTitle, that.locate("title").text());
        jqUnit.assertEquals("The pie's description has been created", that.model.svgDescription, that.locate("description").text());
        jqUnit.assertDeepEq("The pie's title and description are connected through the aria-labelledby attribute of the pie SVG", pieAriaLabelledByAttr, pieTitleId + " " + pieDescId);

        // Test that displayed values are in sync with the current model
        floe.tests.chartAuthoring.testPieTextSyncWithModelDataSet(that);

        // Each slice receives the corresponding data object
        var d3Slices = that.jQueryToD3($(that.locate("slice")));
        d3Slices.each(function (d, i) {
            jqUnit.assertEquals("The slice colors are filled correctly", that.options.pieOptions.colors[i], ($(this).attr("fill")));
            testSliceDataFunc(d, i);
        });
    };

    floe.tests.chartAuthoring.runCommonTests = function (that, testSliceDataFunc) {
        floe.tests.chartAuthoring.validatePie(that, testSliceDataFunc);

        // Test the description value binding
        floe.tests.chartAuthoring.testValueBinding(that, "svgDescription", "description", "An updated pie chart description.");

        // Test the title value binding
        floe.tests.chartAuthoring.testValueBinding(that, "svgTitle", "title", "An updated pie chart title.");

        // The D3 DOM event listener is registered
        jqUnit.assertFalse("The mouseover listener for pie slices have not been triggered", that.mouseOverListenerCalled);
        var oneD3Slice = that.jQueryToD3($(that.locate("slice")[0]));
        oneD3Slice.on("mouseover")();
        jqUnit.assertTrue("The mouseover listener for pie slices have been registered", that.mouseOverListenerCalled);
    };

    floe.tests.chartAuthoring.testPieTextSyncWithModelDataSet = function (that) {
        var dataSet = that.model.dataSet;
        var d3Elem = floe.d3.jQueryToD3(that.locate("text"));
        d3Elem.each(function (d, i) {
            var displayedValue = d3.select(this).text();
            var expectedValue = typeof (dataSet[i]) === "object" ? dataSet[i].value : dataSet[i];
            jqUnit.assertEquals("Displayed values are in sync with the current model", expectedValue, Number(displayedValue));
        });
    };

    floe.tests.chartAuthoring.testPrimitiveData = function (d) {
        jqUnit.assertEquals("The corresponding value is associated with this slice", d.value, d.data);
    };

    floe.tests.chartAuthoring.testObjectData = function (d, i) {
        jqUnit.assertEquals("The corresponding data object is associated with this slice", "object", typeof(d.data));
        jqUnit.assertEquals("The passed in data id is correct", "id" + i, d.data.id);
        jqUnit.assertEquals("The passed in data value is correct", d.data.value, d.value);
    };

    floe.tests.chartAuthoring.numberArray = [5, 10, 20, 45, 6, 25];

    floe.tests.chartAuthoring.numberArrayTotal = 111;

    jqUnit.test("Test the pie chart component created based off an array of numbers", function () {
        jqUnit.expect(34);

        var that = floe.tests.chartAuthoring.pieChart.pie(".floec-ca-pieChart-numberArray", {
            model: {
                dataSet: floe.tests.chartAuthoring.numberArray
            }
        });

        floe.tests.chartAuthoring.runCommonTests(that, floe.tests.chartAuthoring.testPrimitiveData);

        jqUnit.assertEquals("The total value is calculated as expected", floe.tests.chartAuthoring.numberArrayTotal, that.model.total.value);

    });

    floe.tests.chartAuthoring.objectArray = [{
        id: "id0",
        value: 5
    }, {
        id: "id1",
        value: 10
    }, {
        id: "id2",
        value: 20
    }, {
        id: "id3",
        value: 45
    }];

    floe.tests.chartAuthoring.objectArrayTotal = 80;

    floe.tests.chartAuthoring.objectArrayAdd = [{
        id: "id0",
        value: 5
    }, {
        id: "id1",
        value: 10
    }, {
        id: "id2",
        value: 20
    }, {
        id: "id3",
        value: 45
    }, {
        id: "id4",
        value: 6
    }, {
        id: "id5",
        value: 25
    }];

    floe.tests.chartAuthoring.objectArrayAddTotal = 111;

    floe.tests.chartAuthoring.objectArrayRemove = [{
        id: "id0",
        value: 5
    }, {
        id: "id1",
        value: 10
    }, {
        id: "id2",
        value: 45
    }];

    floe.tests.chartAuthoring.objectArrayRemoveTotal = 60;

    floe.tests.chartAuthoring.objectArrayChangeInPlace = [{
        id: "id0",
        value: 25
    }, {
        id: "id1",
        value: 15
    }, {
        id: "id2",
        value: 35
    }];

    floe.tests.chartAuthoring.objectArrayChangeInPlaceTotal = 75;

    jqUnit.test("Test the pie chart component created based off an array of objects", function () {
        jqUnit.expect(132);

        var that = floe.tests.chartAuthoring.pieChart.pie(".floec-ca-pieChart-objectArray", {
            model: {
                dataSet: floe.tests.chartAuthoring.objectArray
            }
        });

        floe.tests.chartAuthoring.runCommonTests(that, floe.tests.chartAuthoring.testObjectData);
        jqUnit.assertEquals("The total value is calculated as expected", floe.tests.chartAuthoring.objectArrayTotal, that.model.total.value);

        // Pie is re-drawn when the data set changes in various ways
        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayAdd);
        floe.tests.chartAuthoring.validatePie(that, floe.tests.chartAuthoring.testObjectData);
        jqUnit.assertEquals("The total value is recalculated as expected", floe.tests.chartAuthoring.objectArrayAddTotal, that.model.total.value);

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayRemove);
        floe.tests.chartAuthoring.validatePie(that, floe.tests.chartAuthoring.testObjectData);
        jqUnit.assertEquals("The total value is recalculated as expected", floe.tests.chartAuthoring.objectArrayRemoveTotal, that.model.total.value);

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayChangeInPlace);
        floe.tests.chartAuthoring.validatePie(that, floe.tests.chartAuthoring.testObjectData);
        jqUnit.assertEquals("The total value is calculated as expected", floe.tests.chartAuthoring.objectArrayChangeInPlaceTotal, that.model.total.value);
    });

    floe.tests.chartAuthoring.percentageArray = [{
        id: "tenPercent",
        value: 20
    }, {
        id: "fiftyPercent",
        value: 100
    }, {
        id: "fortyPercent",
        value: 80
    }];

    jqUnit.test("Test the functions for custom formatting of data values in pie slices", function () {
        jqUnit.expect(3);

        var that = floe.tests.chartAuthoring.pieChart.pie(".floec-ca-pieChart-specialFormatting", {
            model: {
                dataSet: floe.tests.chartAuthoring.percentageArray
            },
            svgOptions: {
                width: "400",
                height: "400"
            },
            pieOptions: {
                sliceTextDisplayTemplate: "%value / %total (%percentage%)",
                sliceTextPercentageDigits: 2
            }
        });


        floe.tests.chartAuthoring.expectedDisplayValues = [
            "20 / 200 (10.00%)",
            "100 / 200 (50.00%)",
            "80 / 200 (40.00%)"
        ];


        var d3Elem = floe.d3.jQueryToD3(that.locate("text"));

        d3Elem.each(function (d, i) {
            var displayedValue = d3.select(this).text();
            jqUnit.assertEquals("Displayed values are in sync with the current model", floe.tests.chartAuthoring.expectedDisplayValues[i], displayedValue);
        });


    });

})(jQuery, fluid);
