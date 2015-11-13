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
        gradeNames: ["floe.chartAuthoring.sonifier", "autoInit"]
    });

    floe.tests.chartAuthoring.dataSet =
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

    jqUnit.test("Test the behaviour of the sonification", function () {
        jqUnit.expect(1);

        var that = floe.tests.chartAuthoring.sonifier({
            model: {
                dataSet: floe.tests.chartAuthoring.dataSet
            }
        });

        jqUnit.assertDeepEq("Sonifier's dataset is converted into the expected sonification", floe.tests.chartAuthoring.sonificationData, that.model.sonifiedData);


        var sonifiedData = that.model.sonifiedData,
            notesDurations = sonifiedData[0].notes.durations,
            notesValues = sonifiedData[0].notes.values,
            envelopeDurations = sonifiedData[0].envelope.durations,
            envelopeValues = sonifiedData[0].envelope.values;

        fluid.defaults("floe.chartAuthoring.dataPianoBand", {
            gradeNames: ["floe.chartAuthoring.electricPianoBand"],

            components: {
                midiNoteSynth: {
                    options: {
                        model: {
                            inputs: {
                                noteSequencer: {
                                    durations: notesDurations,
                                    values:    notesValues
                                }
                            }
                        }
                    }
                },
                pianoEnvelopeSynth: {
                    options: {
                        model: {
                            inputs: {
                                envelopeSequencer: {
                                    durations: envelopeDurations,
                                    values:    envelopeValues
                                }
                            }
                        }
                    }
                },

                carrierSynth: {

                }
            }
        });

        var enviro = flock.init();
        enviro.start();
        floe.chartAuthoring.dataPianoBand();
    });
})(jQuery, fluid);
