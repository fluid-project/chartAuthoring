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

    fluid.defaults("floe.tests.chartAuthoring.sonifier", {
        gradeNames: ["floe.chartAuthoring.sonifier"]
    });

    floe.tests.chartAuthoring.shorterArray = [1, 2];

    floe.tests.chartAuthoring.longerArray = [3, 5, 7, 9];

    floe.tests.chartAuthoring.expectedInterleavedArrayShorterFirst = [1, 3, 2, 5, 7, 9];

    floe.tests.chartAuthoring.expectedInterleavedArrayLongerFirst = [3, 1, 5, 2, 7, 9];


    jqUnit.test("Test the interleave transform", function () {
        jqUnit.expect(2);
        var interleaveTests = [
            {
                msg: "Two differing-length arrays are interleaved as expected (shorter as first argument)",
                array1: floe.tests.chartAuthoring.shorterArray,
                array2: floe.tests.chartAuthoring.longerArray,
                expected: floe.tests.chartAuthoring.expectedInterleavedArrayShorterFirst
            },
            {
                msg: "Two differing-length arrays are interleaved as expected (longer as first argument)",
                array1: floe.tests.chartAuthoring.longerArray,
                array2: floe.tests.chartAuthoring.shorterArray,
                expected: floe.tests.chartAuthoring.expectedInterleavedArrayLongerFirst
            }
        ];

        fluid.each(interleaveTests, function (test) {
            var interleavedArray = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.interleaveTransform(test.array1, test.array2);

            jqUnit.assertDeepEq(test.msg, test.expected, interleavedArray);
        });

    });

    floe.tests.chartAuthoring.unmultipliedValue = 3;

    floe.tests.chartAuthoring.expectedMultipliedValue = 9;

    floe.tests.chartAuthoring.unmultipliedObject = {
        wholeNumber: 1,
        decimal: 1.5,
        fraction: 3 / 8,
        string: "I'm not a number, but I have 1 or 2 in me",
        stringNumber: "3",
        innerObject: {
            wholeNumber: 3,
            decimal: 3.5,
            fraction: 6 / 24
        },
        innerArray: [2, 2.5, 8 / 16, "Still not a numb3r"]
    };

    floe.tests.chartAuthoring.expectedMultipliedObject = {
        wholeNumber: 2,
        decimal: 3,
        fraction: 6 / 8,
        string: "I'm not a number, but I have 1 or 2 in me",
        stringNumber: "3",
        innerObject: {
            wholeNumber: 6,
            decimal: 7,
            fraction: 12 / 24
        },
        innerArray: [4, 5, 16 / 16, "Still not a numb3r"]
    };

    jqUnit.test("Test the multiplication transform", function () {
        jqUnit.expect(3);

        var multiplicationTests = [
            {
                msg: "Object containing mix of number and non-number values is multiplied as expected",
                initial: floe.tests.chartAuthoring.unmultipliedObject,
                expected: floe.tests.chartAuthoring.expectedMultipliedObject,
                multiplier: 2
            },
            {
                msg: "Number value is multiplied as expected",
                initial: floe.tests.chartAuthoring.unmultipliedValue,
                expected: floe.tests.chartAuthoring.expectedMultipliedValue,
                multiplier: 3
            },
            {
                msg: "A string value is simply left alone",
                initial: "I keep telling you I'm not a number",
                expected: "I keep telling you I'm not a number",
                multiplier: 3
            }
        ];

        fluid.each(multiplicationTests, function (test) {
            var multiplied = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.multiplierTransform(test.initial, test.multiplier);

            jqUnit.assertDeepEq(test.msg, test.expected, multiplied);
        });
    });

    floe.tests.chartAuthoring.truthValueTransformArray = [1, 5, 8, 3, 6];

    floe.tests.chartAuthoring.expectedTruthValueTransformArray = ["Less than five", "Greater than or equal to five", "Greater than or equal to five", "Less than five", "Greater than or equal to five"];

    jqUnit.test("Test the truth value transform", function () {
        jqUnit.expect(1);
        var isGtEq5 = function (value) {
            return value >= 5;
        };
        var trueResponse = "Greater than or equal to five";
        var falseResponse = "Less than five";

        var truthTransformed = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.truthValueTransform(floe.tests.chartAuthoring.truthValueTransformArray, isGtEq5, trueResponse, falseResponse);

        jqUnit.assertDeepEq("Array is transformed as expected in response to true/false testing of each item, and the supplied response values for true/false", floe.tests.chartAuthoring.expectedTruthValueTransformArray,  truthTransformed);

    });

    fluid.defaults("floe.tests.chartAuthoring.speedySonifier", {
        gradeNames: ["floe.tests.chartAuthoring.sonifier"],
        components: {
            textToSpeech: {
                options: {
                    model: {
                        utteranceOpts: {
                            "lang": "en-GB",
                            // Speak fast so test finishes quicker
                            "rate": 1.9
                        }
                    }
                }
            }
        },
        playbackOptions: {
            // Play fast so the test finishes quicker
            zoom: 0.10
        }
    });

    floe.tests.chartAuthoring.dataSet =
    {
        entry1: {
            value: 100,
            label: "One"
        },
        entry2: {
            value: 50,
            label: "Two"
        }
    };

    floe.tests.chartAuthoring.sonificationData =
    [
        {
            id: "entry1",
            units: [10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1],
            envelope: {
                durations: [1 / 8, 1 / 4, 1 / 8, 1 / 4, 1 / 8, 1 / 4, 1 / 8, 1 / 4, 1 / 8, 1 / 4, 1 / 8, 1 / 4, 1 / 24, 1 / 12, 1 / 24, 1 / 12, 1 / 24, 1 / 12, 1 / 24, 1 / 12, 1 / 24, 1 / 12, 1 / 24, 1 / 12, 1 / 24, 1 / 12],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [3 / 8, 3 / 8, 3 / 8, 3 / 8, 3 / 8, 3 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8],
                values: [91, 91, 91, 91, 91, 91, 89, 89, 89, 89, 89, 89, 89],
                totalDuration: 3.125
            },
            percentage: 67,
            value: 100,
            label: "One"
        },
        {
            id: "entry2",
            units: [10, 10, 10, 1, 1, 1],
            envelope: {
                durations: [1 / 8, 1 / 4, 1 / 8, 1 / 4, 1 / 8, 1 / 4, 1 / 24, 1 / 12, 1 / 24, 1 / 12, 1 / 24, 1 / 12],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [3 / 8, 3 / 8, 3 / 8, 1 / 8, 1 / 8, 1 / 8],
                values: [91, 91, 91, 89, 89, 89],
                totalDuration: 1.5
            },
            percentage: 33,
            value: 50,
            label: "Two"
        }
    ];

    floe.tests.chartAuthoring.sonificationDataWith2xZoom =
    [
        {
            id: "entry1",
            units: [10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1],
            envelope: {
                durations: [2 / 8, 2 / 4, 2 / 8, 2 / 4, 2 / 8, 2 / 4, 2 / 8, 2 / 4, 2 / 8, 2 / 4, 2 / 8, 2 / 4, 2 / 24, 2 / 12, 2 / 24, 2 / 12, 2 / 24, 2 / 12, 2 / 24, 2 / 12, 2 / 24, 2 / 12, 2 / 24, 2 / 12, 2 / 24, 2 / 12],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [6 / 8, 6 / 8, 6 / 8, 6 / 8, 6 / 8, 6 / 8, 2 / 8, 2 / 8, 2 / 8, 2 / 8, 2 / 8, 2 / 8, 2 / 8],
                values: [91, 91, 91, 91, 91, 91, 89, 89, 89, 89, 89, 89, 89],
                totalDuration: 6.25
            },
            percentage: 67,
            value: 100,
            label: "One"
        },
        {
            id: "entry2",
            units: [10, 10, 10, 1, 1, 1],
            envelope: {
                durations: [2 / 8, 2 / 4, 2 / 8, 2 / 4, 2 / 8, 2 / 4, 2 / 24, 2 / 12, 2 / 24, 2 / 12, 2 / 24, 2 / 12],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [6 / 8, 6 / 8, 6 / 8, 2 / 8, 2 / 8, 2 / 8],
                values: [91, 91, 91, 89, 89, 89],
                totalDuration: 3
            },
            percentage: 33,
            value: 50,
            label: "Two"
        }
    ];

    jqUnit.test("Test the sonification data conversion", function () {
        jqUnit.expect(1);

        var that = floe.tests.chartAuthoring.sonifier({
            model: {
                dataSet: floe.tests.chartAuthoring.dataSet
            }
        });

        jqUnit.assertDeepEq("Dataset is converted into the expected sonification data", floe.tests.chartAuthoring.sonificationData, that.model.sonifiedData);
    });

    jqUnit.test("Test the sonification data conversion with zoom", function () {
        jqUnit.expect(1);

        var that = floe.tests.chartAuthoring.sonifier({
            model: {
                dataSet: floe.tests.chartAuthoring.dataSet
            },
            playbackOptions: {
                zoom: 2
            }
        });

        jqUnit.assertDeepEq("Dataset is converted into the expected sonification with 2x zoom", floe.tests.chartAuthoring.sonificationDataWith2xZoom, that.model.sonifiedData);
    });

    jqUnit.test("Test the sonification play behaviour", function () {
        jqUnit.expect(6);

        var that = floe.tests.chartAuthoring.speedySonifier({
            model: {
                dataSet: floe.tests.chartAuthoring.dataSet
            },
            // We kick off the next test when this one finishes
            listeners: {
                "onSonificationStopped": {
                    funcName: "floe.tests.chartAuthoring.validateStopped",
                    args: "{that}"
                }
            }
        });

        that.events.onSonificationRequested.fire();

        jqUnit.assertTrue("sonificationQueue has expected number of items in it", that.model.sonificationQueue.length === 2);
        fluid.each(that.model.sonificationQueue, function (queueItem, idx) {
            var sonifiedDataItem = that.model.sonifiedData[idx];
            jqUnit.assertDeepEq("sonificationQueue item at position " + idx +  " matches parallel sonifiedData item", queueItem, sonifiedDataItem);
        });
        jqUnit.assertEquals("isPlaying boolean was true after play was started", true, that.model.isPlaying);
        jqUnit.assertFalse("currentlyPlayingData is not null", null, that.model.currentlyPlayingData);
        jqUnit.assertNotUndefined("Synth was created", that.synth);

    });

    floe.tests.chartAuthoring.validateStopped = function (that) {
        jqUnit.test("Test that the stop behaves as expected", function () {
            jqUnit.expect(3);
            jqUnit.assertEquals("isPlaying boolean was false after play finished", false, that.model.isPlaying);
            jqUnit.assertEquals("currentlyPlayingData is null", null, that.model.currentlyPlayingData);
            jqUnit.assertTrue("sonificationQueue is empty after play finished", that.model.sonificationQueue.length === 0);
        });
    };

})(jQuery, fluid);
