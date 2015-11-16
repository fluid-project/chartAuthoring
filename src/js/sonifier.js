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

    fluid.defaults("floe.chartAuthoring.sonifier", {
        gradeNames: ["floe.chartAuthoring.totalRelaying", "fluid.modelComponent"],
        components: {
            textToSpeech: {
                type: "fluid.textToSpeech",
                options:{
                    model: {
                        utteranceOpts: {
                            "lang": "en-US"
                        }
                    }
                }
            }
        },
        model: {
            // dataSet:,
            // sonifiedData:
            // Supplied by relaying in floe.chartAuthoring.totalRelaying grade
            // total: {
            //     value: number,
            //     percentage: number
            // }
        },
        modelListeners: {
            dataSet: {
                funcName: "{that}.sonifyData"
            }
        },
        // can override these to control synth behaviour
        // These need better explanations of what they do
        synthOptions: {
            noteDurationConfig: {
                divisorDuration: 3/8,
                remainderDuration: 1/8
            },
            noteValueConfig: {
                divisorValue: 91,
                remainderValue: 89
            },
            envelopeDurationConfig: {
                divisorDuration: 1/8,
                divisorSilence: 1/4,
                remainderDuration: 1/24,
                remainderSilence: 1/12
            },
            envelopeValuesConfig: {
                openValue: 1.0,
                closedValue: 0.0
            }
        },
        invokers: {
            "sonifyData": {
                funcName: "floe.chartAuthoring.sonifier.dataEntriesToSonificationData",
                args: "{that}"
            },
            "playSonification": {
                funcName: "floe.chartAuthoring.sonifier.playSonification",
                args: "{that}"
            }
        },
        events: {
            // Fire at the end of a completed data sonification
            onDataSonified: null
        }
    });

    // TODO: better implementation, but works for immediate purposes

    floe.chartAuthoring.sonifier.getSonificationUnits = function(value, unitDivisor) {
        var numberDivisors = Math.floor(value / unitDivisor);
        var numberRemainders = value % unitDivisor;
        var divisorArray =[];
        var remainderArray = [];
        for(var i=0; i <numberDivisors; i++) {
            divisorArray.push(unitDivisor);
        }
        for(i=0; i< numberRemainders; i++) {
            remainderArray.push(1);
        }

        return divisorArray.concat(remainderArray);
    };

    floe.chartAuthoring.sonifier.getSonificationNoteDurations = function(units, unitDivisor, noteDurationConfig) {
        var durations = fluid.transform(units, function (unit) {
            if(unit === unitDivisor) {
                return noteDurationConfig.divisorDuration;
            } else {
                return noteDurationConfig.remainderDuration;
            }
        });
        return durations;
    };


    floe.chartAuthoring.sonifier.getSonificationNoteValues = function(units, unitDivisor, noteValueConfig) {
        var durations = fluid.transform(units, function (unit) {
            if(unit === unitDivisor) {
                return noteValueConfig.divisorValue;
            } else {
                return noteValueConfig.remainderValue;
            }
        });
        return durations;
    };

    floe.chartAuthoring.sonifier.getSonificationEnvelopeDurations = function(units, unitDivisor, envelopeDurationConfig) {
        var durations = fluid.transform(units, function (unit) {
            if(unit === unitDivisor) {
                return [envelopeDurationConfig.divisorDuration,envelopeDurationConfig.divisorSilence];
            } else {
                return [envelopeDurationConfig.remainderDuration,envelopeDurationConfig.remainderSilence];
            }
        });

        var durationsJoined = [];

        fluid.each(durations, function(duration) {
            durationsJoined = durationsJoined.concat(duration);
        });

        return durationsJoined;
    };

    floe.chartAuthoring.sonifier.getSonificationEnvelopeValues = function(envelopeDurations, envelopeDurationConfig, envelopeValuesConfig) {
        var envelopeValues = fluid.transform(envelopeDurations, function(duration) {
            if(duration === envelopeDurationConfig.divisorDuration || duration === envelopeDurationConfig.remainderDuration) {
                return envelopeValuesConfig.openValue;
            } else {
                return envelopeValuesConfig.closedValue;
            }
        });
        return envelopeValues;
    };

    // Given an object in the style of floe.chartAuthoring.dataEntryPanel.model.dataEntries,
    // convert it to an array of objects in the style used by the sonification components,
    // maintaining object constancy by using the dataEntry object name as the key
    floe.chartAuthoring.sonifier.dataEntriesToSonificationData = function(that) {
        var dataSet = that.model.dataSet;
        var totalValue = that.model.total.value;
        var sonificationData = [];
        var unitDivisor = 10;
        var noteDurationConfig = that.options.synthOptions.noteDurationConfig,
            noteValueConfig = that.options.synthOptions.noteValueConfig,
            envelopeDurationConfig = that.options.synthOptions.envelopeDurationConfig,
            envelopeValuesConfig = that.options.synthOptions.envelopeValuesConfig;

        fluid.each(dataSet, function(item) {
            if(item.value !== null) {
                var percentage = Number(floe.chartAuthoring.percentage.calculate(item.value, totalValue).toFixed(0));
                var units = floe.chartAuthoring.sonifier.getSonificationUnits(percentage, unitDivisor);
                var noteDurations = floe.chartAuthoring.sonifier.getSonificationNoteDurations(units, unitDivisor, noteDurationConfig);
                var noteValues = floe.chartAuthoring.sonifier.getSonificationNoteValues(units, unitDivisor, noteValueConfig);
                var envelopeDurations = floe.chartAuthoring.sonifier.getSonificationEnvelopeDurations(units, unitDivisor, envelopeDurationConfig);
                var envelopeValues = floe.chartAuthoring.sonifier.getSonificationEnvelopeValues(envelopeDurations, envelopeDurationConfig, envelopeValuesConfig);
                var d = {
                    id: item.id,
                    label: item.label,
                    value: item.value,
                    percentage: percentage,
                    units: units,
                    notes: {
                        durations: noteDurations,
                        values: noteValues
                    },
                    envelope: {
                        durations: envelopeDurations,
                        values: envelopeValues
                    }
                };
                sonificationData.push(d);
            }

        });
        sonificationData.sort(floe.chartAuthoring.pieChart.legend.sortAscending);
        that.model.sonifiedData = sonificationData;
        that.events.onDataSonified.fire();
    };

    floe.chartAuthoring.sonifier.getTotalDuration = function (durationsArray) {
        var totalDuration = 0;
        fluid.each(durationsArray, function(currentDuration) {
            totalDuration = totalDuration+currentDuration;
        });
        return totalDuration;
    };

    floe.chartAuthoring.sonifier.generateVoiceIntervals = function (sonifiedData, start, step) {
        var voiceIntervals = [],
            counter = start,
            intervalStep = step;

        fluid.each(sonifiedData, function(data) {
            var noteDuration = floe.chartAuthoring.sonifier.getTotalDuration(data.notes.durations);
            voiceIntervals.push(counter);
            counter = counter+intervalStep+noteDuration;
        });
        return voiceIntervals;
    };

    floe.chartAuthoring.sonifier.generateSonificationIntervalsWithVoiceTimings = function (sonifiedData, voiceIntervals, waitTimeForSpeech) {
        var dataIntervals = [],
            counter = waitTimeForSpeech,
            waitForSpeech = waitTimeForSpeech;
        fluid.each(sonifiedData, function(data, idx) {
            var nextSpeechInterval = voiceIntervals[idx+1];
            dataIntervals.push(counter);
            counter = nextSpeechInterval+waitForSpeech;
        });
        return dataIntervals;
    };

    floe.chartAuthoring.sonifier.playSonification = function(that) {
        var sonifiedData = that.model.sonifiedData;

        fluid.defaults("floe.chartAuthoring.dataPianoBand", {
            gradeNames: ["floe.chartAuthoring.electricPianoBand"],

            components: {
                scheduler: {
                    type: "flock.scheduler.async",
                    options: {
                        synthContext: "floe.chartAuthoring.electricPianoBand"
                    }
                }
            }
        });

        var enviro = flock.init();
        enviro.start();

        var dataPianoBand = floe.chartAuthoring.dataPianoBand();

        // Voice intervals will come at every 3 seconds + length of the preceding note
        var voiceIntervals = floe.chartAuthoring.sonifier.generateVoiceIntervals(sonifiedData, 0, 3);

        // Start data sonification after 3 seconds, then time them for every six seconds after
        var dataIntervals = floe.chartAuthoring.sonifier.generateSonificationIntervalsWithVoiceTimings(sonifiedData, voiceIntervals, 3);

        // Schedule a change for each piece of data

        fluid.each(sonifiedData, function(data, idx) {
            var SpeechSynthesisUtterance = window.webkitSpeechSynthesisUtterance ||
                           window.mozSpeechSynthesisUtterance ||
                           window.msSpeechSynthesisUtterance ||
                           window.oSpeechSynthesisUtterance ||
                           window.SpeechSynthesisUtterance;
            if(SpeechSynthesisUtterance !== undefined) {
                var currentVoiceInterval = voiceIntervals[idx];
                // console.log("scheduling " + data.label + " speech label at " + currentVoiceInterval + " seconds");
                dataPianoBand.scheduler.once(currentVoiceInterval, function() {
                    // var elapsed = currentVoiceInterval;
                    // console.log("synth change should now occur at " + elapsed + " seconds from start");
                    that.textToSpeech.queueSpeech(data.label);
                });
            }
        });

        fluid.each(sonifiedData, function(data, idx) {
            var currentDataInterval = dataIntervals[idx];
            // console.log("scheduling " + data.label + "sonification at " + currentDataInterval + " seconds");
            dataPianoBand.scheduler.once(currentDataInterval, function() {
                // var elapsed = currentDataInterval;
                // console.log("synth change should now occur at " + elapsed + " seconds from start");
                dataPianoBand.midiNoteSynth.applier.change("inputs.noteSequencer", data.notes);
                dataPianoBand.pianoEnvelopeSynth.applier.change("inputs.envelopeSequencer", data.envelope);
            });
        });

        // TODO: Need to pause the synth (or the whole Flocking environment)
        // after the last segment has played.
    };

})(jQuery, fluid);
