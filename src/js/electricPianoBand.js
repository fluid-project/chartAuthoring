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

    fluid.defaults("floe.chartAuthoring.electricPianoBand", {
        gradeNames: ["flock.band"],

        components: {
            midiNoteSynth: {
                type: "floe.chartAuthoring.midiNoteSynth"
            },

            pianoEnvelopeSynth: {
                type: "floe.chartAuthoring.pianoEnvelopeSynth"
            },

            carrierSynth: {
                type: "floe.chartAuthoring.carrierSynth"
            }
        }
    });

    fluid.defaults("flock.interconnectOutputSynth", {
        gradeNames: ["flock.modelSynth"],

        outputBus: "@expand:{flock.enviro}.busManager.acquireNextBus(interconnect)",

        synthDef: {
            ugen: "flock.ugen.out",
            bus: "{that}.options.outputBus",
            expand: 1,
            sources: "{that}.options.ugenDef"
        }
    });

    fluid.defaults("floe.chartAuthoring.midiNoteSynth", {
        gradeNames: ["flock.interconnectOutputSynth"],

        ugenDef: {
            id: "freq",
            ugen: "flock.ugen.midiFreq",
            rate: "control",
            note: {
                id: "noteSequencer",
                ugen: "flock.ugen.sequencer"
            }
        },

        model: {
            inputs: {
                noteSequencer: {
                    durations: [3/8, 3/8, 1/8, 1/8],
                    values:    [91,  91,  89,  89]
                }
            }
        },

        addToEnvironment: "head"
    });

    fluid.defaults("floe.chartAuthoring.carrierSynth", {
        gradeNames: ["flock.modelSynth"],

        ugenDef: {
            ugen: "flock.ugen.sinOsc",
            phase: 0.0,
            freq: {
                ugen: "flock.ugen.in",
                bus: "{midiNoteSynth}.options.outputBus"
            },

            mul: {
                ugen: "flock.ugen.in",
                bus: "{pianoEnvelopeSynth}.options.outputBus"
            }
        },

        phases: [0.0, 0.5, 0.25],

        synthDef: {
            ugen: "flock.ugen.sum",
            sources: {
                expander: {
                    funcName: "floe.chartAuthoring.carrierSynth.additiveExpander",
                    args: ["{that}.options.phases", "{that}.options.ugenDef"]
                }
            }
        }
    });

    floe.chartAuthoring.carrierSynth.additiveExpander = function (phases, ugenDef) {
        return fluid.transform(phases, function (phaseValue) {
            var voiceDef = fluid.copy(ugenDef);
            voiceDef.phase = phaseValue;
            return voiceDef;
        });
    };

    fluid.defaults("floe.chartAuthoring.pianoEnvelopeSynth", {
        gradeNames: ["flock.interconnectOutputSynth"],

        ugenDef: {
            ugen: "flock.ugen.envGen",
            envelope: {
                levels: [0, 1, 0],
                times: [0.01, 0.05],
                curves: ["linear", -5],
                sustainPoint: 1
            },
            gate: {
                id: "envelopeSequencer",
                ugen: "flock.ugen.sequencer"
            },
            mul: 0.05
        },

        model: {
            inputs: {
                envelopeSequencer: {
                    durations: [1/8, 1/4, 1/8, 1/4, 1/24, 1/12, 1/24, 1/12],
                    values:    [1.0, 0.0, 1.0, 0.0, 1.0,  0.0,  1.0,  0.0]
                }
            }
        },

        addToEnviroment: "head"
    });

})(jQuery, fluid);
