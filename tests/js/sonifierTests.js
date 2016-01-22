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

    fluid.defaults("floe.tests.chartAuthoring.sonifier", {
        gradeNames: ["floe.chartAuthoring.sonifier"]
    });

    fluid.defaults("floe.tests.chartAuthoring.speedySonifier", {
        gradeNames: ["floe.tests.chartAuthoring.sonifier"],
        components: {
            textToSpeech: {
                options:{
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
            units: [10,10,10,10,10,10,1,1,1,1,1,1,1],
            envelope: {
                durations: [1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [3/8, 3/8, 3/8, 3/8, 3/8, 3/8, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8],
                values: [91, 91, 91, 91, 91, 91, 89, 89, 89, 89, 89, 89, 89]
            },
            percentage:67,
            value: 100,
            label: "One"
        },
        {
            id: "entry2",
            units: [10,10,10,1,1,1],
            envelope: {
                durations: [1/8, 1/4, 1/8, 1/4, 1/8, 1/4, 1/24, 1/12, 1/24, 1/12, 1/24, 1/12],
                values: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            notes: {
                durations: [3/8, 3/8, 3/8, 1/8, 1/8, 1/8],
                values: [91, 91, 91, 89, 89, 89]
            },
            percentage:33,
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

        jqUnit.assertDeepEq("Sonifier's dataset is converted into the expected sonification", floe.tests.chartAuthoring.sonificationData, that.model.sonifiedData);
    });

    jqUnit.test("Test the sonification play behaviour", function () {
        jqUnit.expect(2);

        var that = floe.tests.chartAuthoring.speedySonifier({
            model: {
                dataSet: floe.tests.chartAuthoring.dataSet
            },
            listeners: {
                "onSonificationStopped": {
                    funcName: "floe.tests.chartAuthoring.validateStopped",
                    args: "{that}"
                }
            }
        });

        that.playSonification();

        jqUnit.assertEquals("isPlaying boolean was true after play was started", true, that.model.isPlaying);
        jqUnit.assertNotUndefined("Synth was created", that.model.synth);

    });

    floe.tests.chartAuthoring.validateStopped = function(that) {
        jqUnit.test("Test that the stop behaves as expected", function () {
            jqUnit.expect(3);

            jqUnit.assertEquals("isPlaying boolean was false after play finished", false, that.model.isPlaying);
            jqUnit.assertEquals("currentlyPlayingData is null", null, that.model.currentlyPlayingData);
            jqUnit.assertDeepEq("sonificationQueue is empty after play finished", [], that.model.sonificationQueue);
        });
    };

})(jQuery, fluid);
