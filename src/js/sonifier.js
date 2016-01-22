/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

// Initialize the flocking environment
var flockingEnvironment = flock.init();

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
                    },
                    listeners: {
                        "{that}.events.onStop": {
                            funcName: "floe.chartAuthoring.sonifier.playDataAndQueueNext",
                            args: "{floe.chartAuthoring.sonifier}"
                        }
                    }
                }

            }
        },
        model: {
            // dataSet:,
            // sonifiedData:
            // sonificationQueue:
            // synth:
            // currentlyPlayingData:
            // Supplied by relaying in floe.chartAuthoring.totalRelaying grade
            // total: {
            //     value: number,
            //     percentage: number
            // }
            isPlaying: false
        },
        modelListeners: {
            dataSet: {
                funcName: "{that}.sonifyData"
            },
            sonificationQueue: {
                funcName: "{that}.beginSonificationQueue"
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
        // options that control playback behaviour
        playbackOptions: {
            // Additional gap of silence between individual data points when
            // playing a sequence
            gapDuration: 1,
            // Zoom factor - affects the durationConfigs of the synth when
            // played. Higher numbers = slower playback
            zoom: 1
        },
        invokers: {
            "sonifyData": {
                funcName: "floe.chartAuthoring.sonifier.dataEntriesToSonificationData",
                args: "{that}"
            },
            "playSonification": {
                funcName: "floe.chartAuthoring.sonifier.startSonification",
                args: "{that}"
            },
            "stopSonification": {
                funcName: "floe.chartAuthoring.sonifier.stopSonification",
                args: "{that}"
            },
            "beginSonificationQueue": {
                funcName: "floe.chartAuthoring.sonifier.processSonificationQueue",
                args: [0, true, "{that}"]
            }
        },
        events: {
            // Fire at the end of a completed data sonification
            onDataSonified: null,
            // Fires when stopSonification is invokved
            onStopSonification: null
        }
    });

    // Given an object in the style of floe.chartAuthoring.dataEntryPanel.model.dataEntries,
    // convert it to an array of objects in the style used by the sonification components,
    // maintaining object constancy by using the dataEntry object name as the key
    floe.chartAuthoring.sonifier.dataEntriesToSonificationData = function(that) {
        var unitDivisor = 10;
        var sonificationData = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy(that, unitDivisor);
        sonificationData.sort(floe.chartAuthoring.pieChart.legend.sortAscending);
        that.applier.change("sonifiedData",sonificationData);
        that.events.onDataSonified.fire();
    };

    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy = function(that, unitDivisor) {
        var dataSet = that.model.dataSet;

        var totalValue = that.model.total.value;
        var sonificationData = [];
        var synthOptions = that.options.synthOptions;
        var playbackOptions = that.options.playbackOptions;

        var noteDurationConfig = floe.chartAuthoring.sonifier.applyZoomToDurationConfig(synthOptions.noteDurationConfig,playbackOptions.zoom),
            noteValueConfig = synthOptions.noteValueConfig,
            envelopeDurationConfig = floe.chartAuthoring.sonifier.applyZoomToDurationConfig(synthOptions.envelopeDurationConfig,playbackOptions.zoom),
            envelopeValuesConfig = synthOptions.envelopeValuesConfig;

        fluid.each(dataSet, function(item,key) {
            if(item.value !== null) {
                var percentage = Number(floe.chartAuthoring.percentage.calculate(item.value, totalValue).toFixed(0));
                var units = floe.chartAuthoring.sonifier.getSonificationUnits(percentage, unitDivisor);
                var noteDurations = floe.chartAuthoring.sonifier.getSonificationNoteDurations(units, unitDivisor, noteDurationConfig);
                var noteValues = floe.chartAuthoring.sonifier.getSonificationNoteValues(units, unitDivisor, noteValueConfig);
                var envelopeDurations = floe.chartAuthoring.sonifier.getSonificationEnvelopeDurations(units, unitDivisor, envelopeDurationConfig);
                var envelopeValues = floe.chartAuthoring.sonifier.getSonificationEnvelopeValues(envelopeDurations, envelopeDurationConfig, envelopeValuesConfig);
                var d = {
                    id: key,
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

        return sonificationData;
    };


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

    // Get the synthOptions with a zoom factor applied to the durations
    floe.chartAuthoring.sonifier.applyZoomToDurationConfig = function(durationConfig, zoom) {

        var zoomedNoteDurationConfig = fluid.transform(durationConfig, function (duration) {
            return duration * zoom;
        });

        return zoomedNoteDurationConfig;
    };

    // Kicks off a sonification play. Specifically it:
    // - creates the needed Flocking synth
    // - starts the Flocking environment
    // - calls the initial playDataset function that's used recursively to
    // execute a sonification

    floe.chartAuthoring.sonifier.startSonification = function(that) {
        if(!that.model.isPlaying) {
            // console.log("floe.chartAuthoring.sonifier.startSonification");

            flockingEnvironment.start();

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

            var dataPianoBand = floe.chartAuthoring.dataPianoBand();

            // Add the synth to the model
            that.applier.change("synth", dataPianoBand);

            var sonifiedData = that.model.sonifiedData;
            // Copy the sonification definition into the queue
            that.applier.change("sonificationQueue",sonifiedData);
        }
    };

    // Passed a sonified dataset, this function + playDataAndQueueNext acts recursively
    // to loop through the dataset, play a voice label + sonified data, then
    // schedule the next play event based on the timing

    // The "delay" variable manages the time to elapse (in seconds) before
    // beginning the voice label + sonification of the particular datapoint.
    // This is required for scheduling with the Flocking-based synth generator,
    // which plays asynchronously without callbacks, while voice events have
    // callbacks to indicate their speech has completed
    //
    // The basic challenge of scheduling that this approach handles is:
    // - we can calculate in advance how long the sonification of a data point
    // takes by summing note duration, but we can't receive event notification
    // when a sonification completes
    // - we can fire an event when a voice label read completes, but can't know
    // in advance how long it will take to read the label
    floe.chartAuthoring.sonifier.processSonificationQueue = function(delay, noGap, that) {
        that.applier.change("isPlaying", true);
        // console.log("floe.chartAuthoring.sonifier.processSonificationQueue");
        var gapDuration = that.options.playbackOptions.gapDuration;

        var sonificationQueue = that.model.sonificationQueue;

        var synth = that.model.synth;

        var currentData = sonificationQueue[0];

        var textToSpeech = that.textToSpeech;
        // console.log(textToSpeech);

        // Schedule the next voice label, accounting for both the variable-length
        // delay (the time to play the preceding sonification) and the fixed-length
        // gap

        // We shouldn't use the gap if this is the first call for a dataset
        var pause = noGap? delay : delay+gapDuration;
        if(fluid.textToSpeech.isSupported()) {
            synth.scheduler.once(pause, function() {
                that.applier.change("currentlyPlayingData", currentData);
                textToSpeech.queueSpeech(currentData.label);
            });
        }
    };

    // Recursion function called from floe.chartAuthoring.sonifier.processSonificationQueue

    floe.chartAuthoring.sonifier.playDataAndQueueNext = function(that) {
        // console.log("floe.chartAuthoring.sonifier.playDataAndQueueNext");

        var synth = that.model.synth;
        var sonificationQueue = that.model.sonificationQueue;
        var data = sonificationQueue.shift();

        // This prevents an error being thrown if a stop has been called but
        // this function is queued or in the midst of execution
        var noteDuration = (data !== undefined) ? floe.chartAuthoring.sonifier.getTotalDuration(data.notes.durations) : 0;

        if(sonificationQueue.length > 0) {
            floe.chartAuthoring.sonifier.processSonificationQueue(noteDuration, false, that);
        } else {
            // Schedule to stop the sonification after the last sonification is
            // played
            synth.scheduler.once(noteDuration, function() {
                that.stopSonification();
            });
        }
        if(data !== undefined) {
            synth.midiNoteSynth.applier.change("inputs.noteSequencer", data.notes);
            synth.pianoEnvelopeSynth.applier.change("inputs.envelopeSequencer", data.envelope);
        }
    };

    // Given an array containing indiividual durations, accumulate them and
    // return the total duration
    floe.chartAuthoring.sonifier.getTotalDuration = function (durationsArray) {
        var sum = function(duration, runningTotal) {
            return duration+runningTotal;
        };
        return fluid.accumulate(durationsArray, sum, 0);
    };

    floe.chartAuthoring.sonifier.stopSonification = function(that) {
        // console.log("floe.chartAuthoring.sonifier.stopSonification");
        if(that.model.isPlaying) {
            try {
                // Flush the sonification queue
                that.applier.change("sonificationQueue",[]);
                // Flush any outstanding flocking schedulers
                that.model.synth.scheduler.clearAll();
                // Pause the synth
                that.model.synth.pause();
                // Stop any queued voices
                that.textToSpeech.cancel();
            } catch(e) {
                // console.log("Error");
                // console.log(e);
            } finally {
                // Always stop the flocking environment
                flockingEnvironment.stop();
                // Reset the bus manager
                flockingEnvironment.busManager.reset();
                // Always fire the stop event
                that.events.onStopSonification.fire();
                that.applier.change("isPlaying", false);
                that.applier.change("currentlyPlayingData", null);
            }
        }

    };

})(jQuery, fluid);
