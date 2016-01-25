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

    jqUnit.test("Test the data conversion functions", function () {
        jqUnit.expect(1);

        var convertedData = floe.chartAuthoring.dataEntriesToPieChartData(floe.tests.chartAuthoring.dataEntries);
        jqUnit.assertDeepEq("Data conversion between data entries and chart works", floe.tests.chartAuthoring.expectedRelayedDataSet, convertedData);
    });

    // IoC tests
    fluid.defaults("floe.tests.chartAuthoring", {
        gradeNames: ["floe.chartAuthoring"],
        templateLoader: {
            terms: {
                templatePrefix: "../../src/html"
            }
        }
    });

    floe.tests.chartAuthoring.dataEntries =
    {
        entry1: {
            value: 100,
            label: "Label One",
            percentage: "100%"
        },
        entry2: {
            value: 50,
            label: "Label Two",
            percentage: "100%"
        }
    };

    floe.tests.chartAuthoring.expectedRelayedDataSet =
    [
        {
            id: "entry1",
            value: 100,
            label: "Label One"
        },
        {
            id: "entry2",
            value: 50,
            label: "Label Two"
        }
    ];

    floe.tests.chartAuthoring.updateDataSet =
    [
        {
            value: 65,
            label: "Updated Label One"
        },
        {
            value: 75,
            label: "Updated Label Two"
        },
        {
            value: 85,
            label: "Updated Label Three"
        }
    ];

    floe.tests.chartAuthoring.sonificationData =
    [
        {
            id: "entry1",
            units: [10,10,10,10,10,10,1,1,1,1,1,1,1],
            envelope: {
                durations: [0.125, 0.25, 0.125, 0.25, 0.125, 0.25, 0.125, 0.25, 0.125, 0.25, 0.125, 0.25, 0.04166667, 0.0625, 0.04166667, 0.0625, 0.04166667, 0.0625, 0.04166667, 0.0625, 0.04166667, 0.0625, 0.04166667, 0.0625, 0.04166667, 0.0625],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [0.375, 0.375, 0.375, 0.375, 0.375, 0.375, 0.16666667, 0.16666667, 0.16666667, 0.16666667, 0.16666667, 0.16666667, 0.16666667],
                values: [91, 91, 91, 91, 91, 91, 90, 90, 90, 90, 90, 90, 90]
            },
            value: 67,
            label: "Label One"
        },
        {
            id: "entry2",
            units: [10,10,10,1,1,1],
            envelope: {
                durations: [0.125, 0.25, 0.125, 0.25, 0.125, 0.25, 0.04166667, 0.0625, 0.04166667, 0.0625, 0.04166667, 0.0625],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [0.375, 0.375, 0.375, 0.16666667, 0.16666667, 0.16666667],
                values: [91, 91, 91, 90, 90, 90]
            },
            value: 33,
            label: "Label Two"
        }
    ];

    fluid.defaults("floe.tests.chartAuthoringTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            chartAuthoring: {
                type: "floe.tests.chartAuthoring",
                container: ".floec-chartAuthoring",
                createOnEvent: "{chartAuthoringTester}.events.onTestCaseStart"
            },
            chartAuthoringTester: {
                type: "floe.tests.chartAuthoringTester"
            }
        }
    });

    fluid.defaults("floe.tests.chartAuthoringTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test the chart authoring component",
            tests: [{
                name: "Chart Authoring Init",
                expect: 32,
                sequence: [{
                    listener: "floe.tests.chartAuthoringTester.verifyInit",
                    args: ["{chartAuthoring}"],
                    spec: {priority: "last"},
                    event: "{chartAuthoringTest chartAuthoring}.events.onTemplatesLoaded"
                }, {
                    // To work around the issue when two listeners are registered back to back, the second one doesn't get triggered.
                    func: "fluid.identity"
                }, {
                    listener: "floe.tests.chartAuthoringTester.verifyTool",
                    args: ["{floe.tests.chartAuthoring}"],
                    event: "{floe.tests.chartAuthoring}.events.onToolReady"
                }, {
                    func: "{floe.tests.chartAuthoring}.updateDataEntryPanel",
                    args: [floe.tests.chartAuthoring.updateDataSet]
                }, {
                    listener: "floe.tests.chartAuthoringTester.verifyUpdate",
                    args: ["{floe.tests.chartAuthoring}"],
                    event: "{floe.tests.chartAuthoring}.events.onUpdateDataEntryPanel"
                }]
            }]
        }]
    });

    floe.tests.chartAuthoringTester.verifyInit = function (that) {
        fluid.each(that.templateLoader.resources, function (resource, resourceName) {
            jqUnit.assertValue("The resource text for " + resourceName + " should have been fetched", resource.resourceText);
        });
        jqUnit.assertUndefined("The dataEntryPanel has not been instantiated", that.dataEntryPanel);
        jqUnit.assertUndefined("The pieChart has not been instantiated", that.pieChart);
    };

    floe.tests.chartAuthoringTester.verifyTool = function (that) {

        var chartAuthoringInterfaceResources = that.chartAuthoringInterface.options.resources,
            dataEntryPanelResources = that.chartAuthoringInterface.dataEntryPanel.options.resources,
            pieChartResources = that.chartAuthoringInterface.pieChart.options.resources,
            templateLoaderResources = that.templateLoader.resources;

        jqUnit.assertDeepEq("Template has been passed into the chartAuthoringInterface sub-component", chartAuthoringInterfaceResources.template.resourceText, templateLoaderResources.chartAuthoringInterface.resourceText);
        jqUnit.assertDeepEq("Template has been passed into the dataEntryPanel sub-component", dataEntryPanelResources.template.resourceText, templateLoaderResources.dataEntryPanel.resourceText);
        jqUnit.assertDeepEq("Template has been passed into the dataEntry sub-component of the dataEntryPanel sub-component", dataEntryPanelResources.dataEntry.resourceText, templateLoaderResources.dataEntry.resourceText);
        jqUnit.assertDeepEq("Template has been passed into the pieChart sub-component", pieChartResources.template.resourceText, templateLoaderResources.pieChart.resourceText);

        jqUnit.assertNotUndefined("The chartAuthoringInterface has been rendered", that.chartAuthoringInterface.container.html());
        jqUnit.assertNotUndefined("The chartTitle has been rendered", that.chartAuthoringInterface.chartTitle.container.html());
        jqUnit.assertNotUndefined("The chartDescription has been rendered", that.chartAuthoringInterface.chartDescription.container.html());
        jqUnit.assertNotUndefined("The dataEntryPanel has been rendered", that.chartAuthoringInterface.dataEntryPanel.container.html());
        jqUnit.assertNotUndefined("The pieChart has been rendered", that.chartAuthoringInterface.pieChart.container.html());

        floe.tests.chartAuthoringTester.verifyAriaConnections(that);
    };

    floe.tests.chartAuthoringTester.verifyAriaConnections = function (that) {
        var legendTableId = that.chartAuthoringInterface.pieChart.legend.locate("table").attr("id"),
        pieChartPieId = that.chartAuthoringInterface.pieChart.pie.locate("pie").attr("id"),
        dataEntryFormTotalId = that.chartAuthoringInterface.dataEntryPanel.locate("totalValue").attr("id"),
        dataEntryFormAriaControlsAttr = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntryForm").attr("aria-controls"),
        dataEntryFormlId = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntryForm").attr("id"),
        resetAriaControlsAttr = that.chartAuthoringInterface.locate("reset").attr("aria-controls");

        jqUnit.assertDeepEq("The data entry form has an aria-controls attribute properly referencing the pie, legend and total", dataEntryFormAriaControlsAttr, legendTableId + " " + pieChartPieId + " " + dataEntryFormTotalId);
        jqUnit.assertDeepEq("The reset has an aria-controls attribute properly referencing the form, pie, legend and total", resetAriaControlsAttr, dataEntryFormlId + " " + legendTableId + " " + pieChartPieId + " " + dataEntryFormTotalId);
    };


    floe.tests.chartAuthoringTester.verifyUpdate = function(that) {
        floe.tests.chartAuthoringTester.verifyRelay(that);
        floe.tests.chartAuthoringTester.verifyUpdateDataEntryPanel(that);
    };

    // Verify that the updateDataEntryPanel function updates the UI
    floe.tests.chartAuthoringTester.verifyUpdateDataEntryPanel = function(that) {
        // floe.tests.chartAuthoring.updateDataSet
        var dataEntries = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntry");

        var dataEntryLabelSelector = that.chartAuthoringInterface.dataEntryPanel.dataEntry.options.selectors.label;
        var dataEntryValueSelector = that.chartAuthoringInterface.dataEntryPanel.dataEntry.options.selectors.value;

        dataEntries.each(function(idx) {
            var expectedData = floe.tests.chartAuthoring.updateDataSet[idx];

            if(expectedData !== undefined) {
                jqUnit.assertEquals("Testing updated dataEntryPanel UI - displayed label at position " + idx + " matches updated data set label", $(this).find(dataEntryLabelSelector).val(), String(expectedData.label));
                jqUnit.assertEquals("Testing updated dataEntryPanel UI - displayed value at position " + idx + " matches updated data set label", $(this).find(dataEntryValueSelector).val(), String(expectedData.value));
            }
            // $(this).find(dataEntryValueSelector).val();
        });

    };

    // Compares relaying/relayed datasets (from the dataEntryPanel, to the pieChart)
    // and asserts that the values from the dataEntryPanel are properly relayed
    // to their equivalents in the pieChart
    floe.tests.chartAuthoringTester.verifyRelay = function(that) {
        var dataEntryPanelDataSet = that.chartAuthoringInterface.dataEntryPanel.model.dataSet;
        var pieDataSet = that.chartAuthoringInterface.pieChart.model.dataSet;

        // For looping pieDataSet in parallel
        var indexCounter = 0;

        fluid.each(dataEntryPanelDataSet, function(dataEntryPanelData,key) {

            // Don't compare if the dataEntryPanelData has the default blank
            // values (these don't get relayed)
            if(dataEntryPanelData.value !== null && dataEntryPanelData !== "") {
                jqUnit.assertEquals("Comparing relayed dataset - data value of pieChart data in position " + indexCounter + " matches", dataEntryPanelData.value, pieDataSet[indexCounter].value);
                jqUnit.assertEquals("Comparing relayed dataset - label value of pieChart data in position " + indexCounter + " matches", dataEntryPanelData.label, pieDataSet[indexCounter].label);
                jqUnit.assertEquals("Comparing relayed dataset - id value of pieChart data in position " + indexCounter + " matches expected key", key, pieDataSet[indexCounter].id);
            }
            indexCounter++;
        });
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "floe.tests.chartAuthoringTest"
        ]);
    });

})(jQuery, fluid);
