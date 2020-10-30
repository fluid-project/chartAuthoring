/*
Copyright 2015-2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* global fluid, floe, jqUnit */

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
        components: {
            chartAuthoringInterface: {
                options: {
                    components: {
                        sonifier: {
                            type: "floe.tests.chartAuthoring.speedySonifier"
                        }
                    }
                }
            }
        },

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
                name: "Chart Authoring Init, Changes and Button Behaviour",
                expect: 72,
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
                    func: "floe.tests.chartAuthoringTester.verifyUpdateDataEntryPanel",
                    args: ["{floe.tests.chartAuthoring}"]
                }, {
                    func: "floe.tests.chartAuthoringTester.verifyRelay",
                    args: ["{floe.tests.chartAuthoring}"]
                }, {
                    // Simulate click on play button
                    jQueryTrigger: "click",
                    element: "{floe.tests.chartAuthoring}.dom.sonifierPlay"
                }, {
                    // Listen for the sonificationQueue to change in response to
                    // the play button click
                    listener: "floe.tests.chartAuthoringTester.verifySonificationQueued",
                    args: ["{floe.tests.chartAuthoring}"],
                    path: "isPlaying",
                    changeEvent: "{floe.tests.chartAuthoring}.chartAuthoringInterface.sonifier.applier.modelChanged"
                }, {
                    // Simulate click on stop button
                    jQueryTrigger: "click",
                    element: "{floe.tests.chartAuthoring}.dom.sonifierStop"
                }, {
                    // Listen for stop event from button click
                    listener: "floe.tests.chartAuthoringTester.verifySonificationStopped",
                    args: ["{floe.tests.chartAuthoring}"],
                    event: "{floe.tests.chartAuthoring}.chartAuthoringInterface.sonifier.events.onSonificationStopped"
                }, {
                    // Click the play button again
                    jQueryTrigger: "click",
                    element: "{floe.tests.chartAuthoring}.dom.sonifierPlay"
                }, {
                    // Listen to change #1 to currentlyPlayingData
                    listener: "floe.tests.chartAuthoringTester.verifyDatapointPlay",
                    args: ["{floe.tests.chartAuthoring}", 0],
                    path: "currentlyPlayingData",
                    changeEvent: "{floe.tests.chartAuthoring}.chartAuthoringInterface.sonifier.applier.modelChanged"
                }, {
                    func: "fluid.identity"
                }, {
                    // Listen to change #2 to currentlyPlayingData
                    listener: "floe.tests.chartAuthoringTester.verifyDatapointPlay",
                    args: ["{floe.tests.chartAuthoring}", 1],
                    path: "currentlyPlayingData",
                    changeEvent: "{floe.tests.chartAuthoring}.chartAuthoringInterface.sonifier.applier.modelChanged"
                }, {
                    func: "fluid.identity"
                }, {
                    // Listen to change #3 to currentlyPlayingData
                    listener: "floe.tests.chartAuthoringTester.verifyDatapointPlay",
                    args: ["{floe.tests.chartAuthoring}", 2],
                    path: "currentlyPlayingData",
                    changeEvent: "{floe.tests.chartAuthoring}.chartAuthoringInterface.sonifier.applier.modelChanged"
                }, {
                    func: "fluid.identity"
                }, {
                    // Listen for "natural" stop event
                    listener: "floe.tests.chartAuthoringTester.verifySonificationStopped",
                    args: ["{floe.tests.chartAuthoring}"],
                    event: "{floe.tests.chartAuthoring}.chartAuthoringInterface.sonifier.events.onSonificationStopped"
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
            pieChartPieId = that.chartAuthoringInterface.pieChart.pie.locate("svg").attr("id"),
            dataEntryFormTotalId = that.chartAuthoringInterface.dataEntryPanel.locate("totalValue").attr("id"),
            dataEntryFormAriaControlsAttr = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntryForm").attr("aria-controls"),
            dataEntryFormId = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntryForm").attr("id"),
            resetAriaControlsAttr = that.chartAuthoringInterface.locate("reset").attr("aria-controls");

        jqUnit.assertDeepEq("The data entry form has an aria-controls attribute properly referencing the pie, legend and total", dataEntryFormAriaControlsAttr, legendTableId + " " + pieChartPieId + " " + dataEntryFormTotalId);
        jqUnit.assertDeepEq("The reset has an aria-controls attribute properly referencing the form, pie, legend and total", resetAriaControlsAttr, dataEntryFormId + " " + legendTableId + " " + pieChartPieId + " " + dataEntryFormTotalId);
    };

    // Verify that the updateDataEntryPanel function updates the UI
    floe.tests.chartAuthoringTester.verifyUpdateDataEntryPanel = function (that) {
        that.updateDataEntryPanelFromDataSet(floe.tests.chartAuthoring.updateDataSet);

        var dataEntries = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntry");

        var dataEntryLabelSelector = that.chartAuthoringInterface.dataEntryPanel.dataEntry.options.selectors.label;
        var dataEntryValueSelector = that.chartAuthoringInterface.dataEntryPanel.dataEntry.options.selectors.value;

        dataEntries.each(function (idx) {

            // Confirm that each entry in updateDataSet has a matching dataEntry
            // in the panel UI, or that the "matching" dataEntry is blank when
            // the dataset is shorter than the number of possible data entries

            var expectedData = idx < floe.tests.chartAuthoring.updateDataSet.length ? floe.tests.chartAuthoring.updateDataSet[idx] : expectedData = {label: "", value: ""};

            jqUnit.assertEquals("Testing updated dataEntryPanel UI - displayed label at position " + idx + " matches updated data set label", $(this).find(dataEntryLabelSelector).val(), String(expectedData.label));
            jqUnit.assertEquals("Testing updated dataEntryPanel UI - displayed value at position " + idx + " matches updated data set label", $(this).find(dataEntryValueSelector).val(), String(expectedData.value));

        });
    };

    // Compares relaying/relayed datasets (from the dataEntryPanel, to the pieChart)
    // and asserts that the values from the dataEntryPanel are properly relayed
    // to their equivalents in the pieChart
    floe.tests.chartAuthoringTester.verifyRelay = function (that) {
        var dataEntryPanelDataSet = that.chartAuthoringInterface.dataEntryPanel.model.dataSet;
        var pieDataSet = that.chartAuthoringInterface.pieChart.model.dataSet;

        // For looping pieDataSet in parallel
        var indexCounter = 0;

        fluid.each(dataEntryPanelDataSet, function (dataEntryPanelData, key) {

            // Don't compare if the dataEntryPanelData has the default blank
            // values (these don't get relayed)
            if (dataEntryPanelData.value !== null && dataEntryPanelData !== "") {
                jqUnit.assertEquals("Comparing relayed dataset - data value of pieChart data in position " + indexCounter + " matches", dataEntryPanelData.value, pieDataSet[indexCounter].value);
                jqUnit.assertEquals("Comparing relayed dataset - label value of pieChart data in position " + indexCounter + " matches", dataEntryPanelData.label, pieDataSet[indexCounter].label);
                jqUnit.assertEquals("Comparing relayed dataset - id value of pieChart data in position " + indexCounter + " matches expected key", key, pieDataSet[indexCounter].id);
            }
            indexCounter++;
        });
    };

    // Verifies that a play button click triggers the sonification request to
    // begin - there are items in the queue but currentlyPlayingData is empty
    floe.tests.chartAuthoringTester.verifySonificationQueued = function (that) {
        var sonifier = that.chartAuthoringInterface.sonifier;
        jqUnit.assertEquals("Sonifier queue is full", 3, sonifier.model.sonificationQueue.length);
        jqUnit.assertUndefined("No currentlyPlayingData", sonifier.currentlyPlayingData);
    };

    // Verify a stop button click triggers the sonification to stop -
    // the queue is empty, no currentlyPlayingData
    floe.tests.chartAuthoringTester.verifySonificationStopped = function (that) {
        var sonifier = that.chartAuthoringInterface.sonifier;
        jqUnit.assertEquals("Sonifier queue is empty", 0, sonifier.model.sonificationQueue.length);
        jqUnit.assertUndefined("No currentlyPlayingData", sonifier.currentlyPlayingData);
    };

    // Verifies datapoint play behaviour in the context of the chart authoring
    // tool; idx should be supplied by the testCaseHolder as each subsequent
    // sonification event is listened for, to look up the expected playing
    // data (which moves from sonificationQueue to currentlyPlayingData as the
    // play occurs) against the unchanging sonifiedData
    floe.tests.chartAuthoringTester.verifyDatapointPlay = function (that, idx) {

        var matchingSonifiedData = that.chartAuthoringInterface.sonifier.model.sonifiedData[idx];

        var cases = [
            {
                msg: "ActiveRowId is the id of the currently playing data in the sonifier",
                input: that.chartAuthoringInterface.pieChart.legend.model.activeRowId,
                expected: that.chartAuthoringInterface.sonifier.model.currentlyPlayingData.id
            },
            {
                msg: "activeSliceId is the id of the currently playing data in the sonifier",
                input: that.chartAuthoringInterface.pieChart.pie.model.activeSliceId,
                expected: that.chartAuthoringInterface.sonifier.model.currentlyPlayingData.id
            },
            {
                msg: "activeRowId on play #" + idx + " is the id the sonified dataset has at position " + idx,
                input: that.chartAuthoringInterface.pieChart.legend.model.activeRowId,
                expected: matchingSonifiedData.id
            },
            {
                msg: "activeSliceId on play #" + idx + "is the id the sonified dataset has at position " + idx,
                input: that.chartAuthoringInterface.pieChart.pie.model.activeSliceId,
                expected: matchingSonifiedData.id
            }
        ];

        fluid.each(cases, function (oneCase) {
            jqUnit.assertEquals(oneCase.msg, oneCase.expected, oneCase.input);
        });

        floe.tests.chartAuthoringTester.verifyPlayHighlighting(that.chartAuthoringInterface.pieChart.legend, that.chartAuthoringInterface.pieChart.legend.model.activeRowId, that.chartAuthoringInterface.pieChart.legend.options.styles.highlight);

        floe.tests.chartAuthoringTester.verifyPlayHighlighting(that.chartAuthoringInterface.pieChart.legend, that.chartAuthoringInterface.pieChart.pie.model.activeSliceId, that.chartAuthoringInterface.pieChart.pie.options.styles.highlight);
    };

    floe.tests.chartAuthoringTester.verifyPlayHighlighting = function (d3ViewComponent, currentlyPlayingDataId, highlightClass) {
        var activeElements = d3ViewComponent.getElementsByDataKey(currentlyPlayingDataId);
        var activeElementClasses = activeElements.attr("class");
        jqUnit.assertTrue("Active element contains the highlight class", activeElementClasses.indexOf(highlightClass) > -1);

        var inactiveElements = floe.d3ViewComponent.getElementsByDataKeys(fluid.keys(d3ViewComponent.model.dataKeys), d3ViewComponent);
        fluid.remove_if(inactiveElements, function (elem) {
            return floe.d3.idExtractor(elem.__data__) === currentlyPlayingDataId;
        });

        fluid.each(inactiveElements, function (currentElem) {
            var elemClass = $(currentElem).attr("class");
            jqUnit.assertFalse("Inactive elements do not contain the highlight class", elemClass.indexOf(highlightClass) > -1);
        });
    };

    $(document).ready(function () {
        if (fluid.textToSpeech.isSupported()) {
            fluid.test.runTests([
                "floe.tests.chartAuthoringTest"
            ]);
        } else {
            jqUnit.test("Further chart authoring tests skipped; browser does not support TTS", function () {
                jqUnit.expect(0);
            });
        }
    });

})(jQuery, fluid);
