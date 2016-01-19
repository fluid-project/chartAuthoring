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


    // Given an array containing durations, accumulate them and return the
    // total duration
    floe.chartAuthoring.sonifier.getTotalDuration = function (durationsArray) {
        var totalDuration = 0;
        fluid.each(durationsArray, function(currentDuration) {
            totalDuration = totalDuration+currentDuration;
        });
        return totalDuration;
    };

    // Passed a sonified dataset, this function acts recursively to loop through
    // the dataset, play a voice label + sonified data, then schedule the next
    // play event based on the timing
    // The "delay" variable should be the time to elapse (in seconds) before
    // beginning the sonification of the particular datapoint. This is required
    // for scheduling with the Flocking-based synth generator, which plays
    // asynchronously without callbacks, while voice events have callbacks to
    // indicate their speech has completed

    floe.chartAuthoring.sonifier.playDataset = function(synth, dataset, delay) {
        // console.log("floe.chartAuthoring.sonifier.playDataset");

        // The nature of this function and the use of Array.shift() means that it
        // is destructive to whatever sonified dataset is passed - therefore, we
        // make a copy
        var clonedDataset = fluid.copy(dataset);
        var data = clonedDataset.shift();
        var voiceLabel = new SpeechSynthesisUtterance(data.label);
        var noteDuration = floe.chartAuthoring.sonifier.getTotalDuration(data.notes.durations);
        voiceLabel.onend = function() {
            // console.log("Voice label for " + data.label + " finshed");
            if(clonedDataset.length > 0) {
                floe.chartAuthoring.sonifier.playDataset(synth, clonedDataset, noteDuration);
            } else {
                // TODO: Need to pause the synth (or the whole Flocking environment)
                // after the last segment has played.
                synth.scheduler.once(noteDuration, function() {
                    // console.log("TODO: stop environment");
                });
            }

            synth.midiNoteSynth.applier.change("inputs.noteSequencer", data.notes);
            synth.pianoEnvelopeSynth.applier.change("inputs.envelopeSequencer", data.envelope);
        };

        synth.scheduler.once(delay, function() {
            window.speechSynthesis.speak(voiceLabel);
        });
    };

    floe.chartAuthoring.sonifier.playSonification = function(that) {
        // console.log("floe.chartAuthoring.sonifier.playFunctionalSonification");
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

        floe.chartAuthoring.sonifier.playDataset(dataPianoBand, sonifiedData, 0);
    };

})(jQuery, fluid);
