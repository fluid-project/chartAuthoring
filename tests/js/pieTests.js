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

    fluid.defaults("floe.tests.chartAuthoring.pieChart.pie", {
        gradeNames: ["floe.chartAuthoring.pieChart.pie", "autoInit"],
        pieOptions: {
            width: 200,
            height: 200,
            colors: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#aabbcc", "#ccbbaa"]
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

    floe.tests.chartAuthoring.mouseOverListener = function (data, i, that) {
        that.mouseOverListenerCalled = true;
    };

    floe.tests.chartAuthoring.validatePie = function (that, testSliceDataFunc) {
        var pie = that.locate("pie");

        // Test the drawing
        jqUnit.assertNotEquals("The SVG element is created with the proper selector", 0, pie.length);
        jqUnit.assertEquals("The width is set correctly on the pie chart", that.options.pieOptions.width, pie.attr("width"));
        jqUnit.assertEquals("The height is set correctly on the pie chart", that.options.pieOptions.height, pie.attr("height"));
        jqUnit.assertEquals("The pie slices have been created with the proper selectors", that.model.dataSet.length, that.locate("slice").length);
        jqUnit.assertEquals("The texts for pie slices have been created with the proper selectors", that.model.dataSet.length, that.locate("text").length);

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

        // The D3 DOM event listener is registered
        jqUnit.assertFalse("The mouseover listener for pie slices have not been triggered", that.mouseOverListenerCalled);
        var oneD3Slice = that.jQueryToD3($(that.locate("slice")[0]));
        oneD3Slice.on("mouseover")();
        jqUnit.assertTrue("The mouseover listener for pie slices have been registered", that.mouseOverListenerCalled);
    };

    floe.tests.chartAuthoring.testPieTextSyncWithModelDataSet = function(that) {
        var dataSet = that.model.dataSet;
        var d3Elem = floe.d3.jQueryToD3(that.locate("text"));
        d3Elem.each(function (d,i) {
            var displayedValue = d3.select(this).text();
            var expectedValue = typeof (dataSet[i]) === "object" ? dataSet[i].value : dataSet[i];
            jqUnit.assertEquals("Displayed values are in sync with the current model", expectedValue, displayedValue);
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

    jqUnit.test("Test the pie chart component created based off an array of numbers", function () {
        jqUnit.expect(25);

        var that = floe.tests.chartAuthoring.pieChart.pie(".floec-ca-pieChart-numberArray", {
            model: {
                dataSet: floe.tests.chartAuthoring.numberArray
            }
        });

        floe.tests.chartAuthoring.runCommonTests(that, floe.tests.chartAuthoring.testPrimitiveData);
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

    jqUnit.test("Test the pie chart component created based off an array of objects", function () {
        jqUnit.expect(102);

        var that = floe.tests.chartAuthoring.pieChart.pie(".floec-ca-pieChart-objectArray", {
            model: {
                dataSet: floe.tests.chartAuthoring.objectArray
            }
        });

        floe.tests.chartAuthoring.runCommonTests(that, floe.tests.chartAuthoring.testObjectData);

        // Pie is re-drawn when the data set changes
        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayAdd);
        floe.tests.chartAuthoring.validatePie(that, floe.tests.chartAuthoring.testObjectData);

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayRemove);
        floe.tests.chartAuthoring.validatePie(that, floe.tests.chartAuthoring.testObjectData);

        that.applier.change("dataSet", floe.tests.chartAuthoring.objectArrayChangeInPlace);
        floe.tests.chartAuthoring.validatePie(that, floe.tests.chartAuthoring.testObjectData);
    });

})(jQuery, fluid);
