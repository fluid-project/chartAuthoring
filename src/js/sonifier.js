/*
Copyright 2016 OCAD University

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
        gradeNames: ["floe.chartAuthoring.totalRelaying"],
        components: {
            textToSpeech: {
                type: "fluid.textToSpeech",
                options: {
                    model: {
                        utteranceOpts: {
                            "lang": "en-US"
                        }
                    }
                }

            },
            synth: {
                createOnEvent: "onSynthNeeded",
                type: "floe.chartAuthoring.electricPianoBand",
                options: {
                    components: {
                        scheduler: {
                            type: "flock.scheduler.async",
                            options: {
                                synthContext: "floe.chartAuthoring.electricPianoBand"
                            }
                        }
                    }
                }
            }
        },
        model: {
            // dataSet:,
            // sonifiedData:
            // sonificationQueue:
            // currentlyPlayingData:
            // Supplied by relaying in floe.chartAuthoring.totalRelaying grade
            // total: {
            //     value: number,
            //     percentage: number
            // }
            isPlaying: false,
            isTextToSpeechSupported: {
                expander: {
                    func: "fluid.textToSpeech.isSupported"
                }
            }
        },
        modelListeners: {
            dataSet: {
                funcName: "{that}.sonifyData"
            },
            sonificationQueue: {
                funcName: "{that}.beginSonificationQueue"
            }
        },
        // can override these to control sonification behaviour
        // These need better explanations of what they do
        sonificationOptions: {
            strategies: {
                unitDivisor: {
                    config: {
                        unitDivisorValue: 10,
                        notes: {
                            durations: {
                                play: {
                                    divisorReturnValue: 3 / 8,
                                    remainderReturnValue: 1 / 8
                                }
                            },
                            values: {
                                divisorReturnValue: 91,
                                remainderReturnValue: 89
                            }
                        },
                        envelope: {
                            durations: {
                                play: {
                                    divisorReturnValue: 1 / 8,
                                    remainderReturnValue: 1 / 24
                                },
                                silence: {
                                    divisorReturnValue: 1 / 4,
                                    remainderReturnValue: 1 / 12
                                }
                            },
                            values: {
                                openValue: 1.0,
                                closedValue: 0.0
                            }
                        }
                    }
                }
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
            },
            "playDataAndQueueNext" : {
                funcName: "floe.chartAuthoring.sonifier.playDataAndQueueNext",
                args: ["{that}"]
            },
            "unitDivisorSonificationStrategy": {
                funcName: "floe.chartAuthoring.sonifier.unitDivisorStrategy",
                args: ["{that}", "{that}.options.sonificationOptions.strategies.unitDivisor.config.unitDivisorValue"]
            },
            // Calls the default sonification strategy
            "defaultSonificationStrategy": "{that}.unitDivisorSonificationStrategy"
        },
        events: {
            // Fires to trigger creation of the synth the first time it's needed
            onSynthNeeded: null,
            // Fires when a sonification play begins
            onSonificationStarted: null,
            // Fires when a voice label read finishes (via event injection),
            // or is fired manually by the floe.chartAuthoring.sonifier.scheduleNextPlayData
            // function
            onVoiceLabelCompleted: "{textToSpeech}.events.onStop",
            // Fires when stopSonification function is called
            onSonificationStopped: null
        },
        listeners: {
            "onVoiceLabelCompleted": "{that}.playDataAndQueueNext"
        }
    });

    // Given an object in the style of floe.chartAuthoring.dataEntryPanel.model.dataEntries,
    // convert it to an array of objects in the style used by the sonification components,
    // maintaining object constancy by using the dataEntry object name as the key
    floe.chartAuthoring.sonifier.dataEntriesToSonificationData = function (that) {
        var sonificationData = that.defaultSonificationStrategy();
        that.applier.change("sonifiedData", sonificationData);
    };

    // Creates a sonified data set based on unit divisors
    // Longer tones represent the unit divisor, while a short tones is played
    // for each remaining "1" of the remainder
    floe.chartAuthoring.sonifier.unitDivisorStrategy = function (that, unitDivisor) {
        var dataSet = that.model.dataSet;

        var totalValue = that.model.total.value;
        var sonificationData = [];
        var sonificationOptions = that.options.sonificationOptions;
        var playbackOptions = that.options.playbackOptions;

        var noteDurationConfig = floe.chartAuthoring.sonifier.applyZoomToDurationConfig(sonificationOptions.strategies.unitDivisor.config.notes.durations.play, playbackOptions.zoom),
            noteValueConfig = sonificationOptions.strategies.unitDivisor.config.notes.values,
            envelopeDurationConfig = floe.chartAuthoring.sonifier.applyZoomToDurationConfig(sonificationOptions.strategies.unitDivisor.config.envelope.durations, playbackOptions.zoom),
            envelopeValuesConfig = sonificationOptions.strategies.unitDivisor.config.envelope.values;

        fluid.each(dataSet, function (item, key) {
            if (item.value !== null) {
                var percentage = Number(floe.chartAuthoring.percentage.calculate(item.value, totalValue).toFixed(0));
                var units = floe.chartAuthoring.sonifier.getDivisorStrategyUnits(percentage, unitDivisor);
                var noteDurations = floe.chartAuthoring.sonifier.getConfigByDivisor(units, unitDivisor, noteDurationConfig);
                var noteValues = floe.chartAuthoring.sonifier.getConfigByDivisor(units, unitDivisor, noteValueConfig);
                var envelopeDurations = floe.chartAuthoring.sonifier.getSonificationEnvelopeDurationsByDivisor(units, unitDivisor, envelopeDurationConfig);
                var envelopeValues = floe.chartAuthoring.sonifier.getSonificationEnvelopeValuesByDivisor(envelopeDurations, envelopeDurationConfig, envelopeValuesConfig);
                var d = {
                    id: key,
                    label: item.label,
                    value: item.value,
                    percentage: percentage,
                    units: units,
                    notes: {
                        durations: noteDurations,
                        values: noteValues,
                        totalDuration: floe.chartAuthoring.sonifier.getTotalDuration(noteDurations)
                    },
                    envelope: {
                        durations: envelopeDurations,
                        values: envelopeValues
                    }
                };
                sonificationData.push(d);
            }

        });
        sonificationData.sort(floe.chartAuthoring.utils.sortAscending);
        return sonificationData;
    };


    // Given an array containing indiividual durations, accumulate them and
    // return the total duration
    floe.chartAuthoring.sonifier.getTotalDuration = function (durationsArray) {
        var sum = function (duration, runningTotal) {
            return duration + runningTotal;
        };
        return fluid.accumulate(durationsArray, sum, 0);
    };

    // Given a value and a divisor, return an array consisting of
    // - the number of divisors
    // - the remainder divided by 1
    // The value "32" with unitDivisor "10" converts into the following array:
    // [10, 10, 10, 1, 1]
    floe.chartAuthoring.sonifier.getDivisorStrategyUnits = function (value, unitDivisor) {
        var numberDivisors = Math.floor(value / unitDivisor);
        var numberRemainders = value % unitDivisor;
        var divisorArray = [];
        var remainderArray = [];
        for (var i = 0; i < numberDivisors; i++) {
            divisorArray.push(unitDivisor);
        }
        for (i = 0; i < numberRemainders; i++) {
            remainderArray.push(1);
        }

        return divisorArray.concat(remainderArray);
    };

    // Given an array of units consisting of divisor and remainder values
    // such as the one produced by floe.chartAuthoring.sonifier.getDivisorStrategyUnits
    // and a config, returns an array with those divisor and remainder
    // values translated into the equivalent units required for sonification
    //
    // Used to generate value and duration configs
    floe.chartAuthoring.sonifier.getConfigByDivisor = function (units, unitDivisor, config) {
        var collection = fluid.transform(units, function (unit) {
            return config[unit === unitDivisor ? "divisorReturnValue" : "remainderReturnValue"];
        });
        return collection;
    };

    floe.chartAuthoring.sonifier.getSonificationEnvelopeDurationsByDivisor = function (units, unitDivisor, envelopeDurationConfig) {
        var playDurations = floe.chartAuthoring.sonifier.getConfigByDivisor(units, unitDivisor, envelopeDurationConfig.play);

        var silenceDurations = floe.chartAuthoring.sonifier.getConfigByDivisor(units, unitDivisor, envelopeDurationConfig.silence);

        return floe.chartAuthoring.sonifier.interleaveTransform(playDurations, silenceDurations);
    };

    floe.chartAuthoring.sonifier.getSonificationEnvelopeValuesByDivisor = function (envelopeDurations, envelopeDurationConfig, envelopeValuesConfig) {

        var isDurationMatchesPlayValue = function (duration) {
            return duration === envelopeDurationConfig.play.divisorReturnValue || duration === envelopeDurationConfig.play.remainderReturnValue;
        };

        return  floe.chartAuthoring.sonifier.truthValueTransform(envelopeDurations, isDurationMatchesPlayValue, envelopeValuesConfig.openValue, envelopeValuesConfig.closedValue);
    };

    // Given an array of values, a truthFunction and values to return when the
    // truth function is true or false, return another array of values based on
    // testing each value in the original array
    floe.chartAuthoring.sonifier.truthValueTransform = function (valueArray, truthFunction, trueValue, falseValue) {
        var transformedArray = fluid.transform(valueArray, function (value) {
            var testedValue = truthFunction(value) ? trueValue : falseValue;
            return testedValue;
        });
        return transformedArray;
    };


    // Given two arrays, interleaves them together, starting with the first item of array1
    floe.chartAuthoring.sonifier.interleaveTransform = function (array1, array2) {
        var longerArray = array1.length >= array2.length ? array1 : array2;

        var interleaved = fluid.transform(longerArray, function (item, index) {
            var array1Item = array1[index],
                array2Item = array2[index];

            return (array1Item !== undefined && array2Item !== undefined) ? [array1[index], array2[index]] : array1Item !== undefined ? [array1Item] : array2Item !== undefined ? array2Item : [];
        });

        var concat = function (curentArray, totalArray) {
            return totalArray.concat(curentArray);
        };

        return fluid.accumulate(interleaved, concat, []);

    };

    // 1. Given a value, returns that value * the supplied multiplier if numeric,
    // or the value untransformed if not typeof === number
    // 2. Given an object, recursively traverses the object any numeric values
    // and returns the object with all numeric values transformed by the
    // multiplier value; non-numeric values are left unchanged
    // Uses typeof rather than isNan to test if it should multiply for
    // stricter compliance with whether or not a value is a "number"
    // ("3", false, and "" are all treated as numbers by isNan())

    floe.chartAuthoring.sonifier.multiplierTransform = function (object, multiplier) {
        if (fluid.isPlainObject(object)) {
            var transformed = fluid.transform(object, function (v) {
                    return floe.chartAuthoring.sonifier.multiplierTransform(v, multiplier);
                });
            return transformed;
        } else {
            return typeof object === "number" ? object * multiplier : object;
        }
    };

    // Get the sonificationOptions with a zoom factor applied to the durations
    floe.chartAuthoring.sonifier.applyZoomToDurationConfig = function (durationConfig, zoom) {
        var zoomedNoteDurationConfig = fluid.transform(durationConfig, function (duration) {
            return floe.chartAuthoring.sonifier.multiplierTransform(duration, zoom);
        });
        return zoomedNoteDurationConfig;
    };

    // Kicks off a sonification play. Specifically it:
    // - creates the needed Flocking synth
    // - starts the Flocking environment
    // - calls the initial playDataset function that's used recursively to
    // execute a sonification

    floe.chartAuthoring.sonifier.startSonification = function (that) {
        if (that.model.isPlaying) {
            return;
        }

        // Create the synth if needed
        if (that.synth === undefined) {
            that.events.onSynthNeeded.fire();
        }

        // Fire the start event
        that.events.onSonificationStarted.fire();

        // Start the flocking environment
        flockingEnvironment.start();

        // Copy the sonification definition into the queue
        that.applier.change("sonificationQueue", that.model.sonifiedData);
    };

    // Passed a sonified dataset, this function + others acts recursively
    // to loop through the dataset, play a voice label (if TTS is enabled) +
    // sonified data, then schedule the next play event based on the timing

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
    floe.chartAuthoring.sonifier.processSonificationQueue = function (delay, noGap, that) {
        var sonificationQueue = that.model.sonificationQueue;
        if (sonificationQueue.length === 0) {
            return;
        }
        that.applier.change("isPlaying", true);
        var gapDuration = that.options.playbackOptions.gapDuration;

        // We shouldn't use the gap if this is the first call for a dataset
        var pause = noGap ? delay : delay + gapDuration;

        floe.chartAuthoring.sonifier.scheduleNextPlayData(pause, that);
    };

    // Schedule the next data play
    floe.chartAuthoring.sonifier.scheduleNextPlayData = function (delay, that) {

        var synth = that.synth;
        var headOfQueueData = that.model.sonificationQueue[0];
        var textToSpeech = that.textToSpeech;

        // When TTS is available, adds speech labels and relies on the
        // textToSpeech.onStop.playDataAndQueueNext event to fire (via
        // injection) the onVoiceLabelCompleted event that's listened to for
        // kicking off the next data play; when TTS is unavailable, simply fires
        // the onVoiceLabelCompleted event ("completed" in the sense that it's)
        // not supported and we should simply move on

        synth.scheduler.once(delay, function () {
            that.applier.change("currentlyPlayingData", headOfQueueData);
            if (that.model.isTextToSpeechSupported) {
                textToSpeech.queueSpeech(headOfQueueData.label);
            } else {
                that.events.onVoiceLabelCompleted.fire();
            }
        });
    };

    // Recursion function called from floe.chartAuthoring.sonifier.processSonificationQueue

    floe.chartAuthoring.sonifier.playDataAndQueueNext = function (that) {
        var synth = that.synth;
        var sonificationQueue = that.model.sonificationQueue;

        // Pops the next data to be sonified out of the queue and into
        // the variable
        var data = sonificationQueue.shift();

        // Calculate the noteDuration to be used when calling the
        // processSonificationQueue function recursively to clear the queue;
        // this is used to delay the actual playing until the prior data has
        // completed its play
        //
        // The check for undefined prevents an error if a stop has been called
        // but this function is queued or in the midst of execution
        var noteDuration = (data !== undefined) ? data.notes.totalDuration : 0;

        // Recursively calls processSonificationQueue again if the queue isn't
        // empty yet
        if (sonificationQueue.length > 0) {
            floe.chartAuthoring.sonifier.processSonificationQueue(noteDuration, false, that);
        } else {
            // Schedule to stop the sonification after the last sonification is
            // played
            synth.scheduler.once(noteDuration, function () {
                that.stopSonification();
            });
        }
        if (data !== undefined) {
            synth.midiNoteSynth.applier.change("inputs.noteSequencer", data.notes);
            synth.pianoEnvelopeSynth.applier.change("inputs.envelopeSequencer", data.envelope);
        }
    };

    floe.chartAuthoring.sonifier.stopSonification = function (that) {

        if (!that.model.isPlaying) {
            return;
        }

        // Empty the sonification queue
        that.applier.change("sonificationQueue", []);

        // Clear any outstanding schedulers on the synth
        that.synth.scheduler.clearAll();

        var emptySequence = {
            durations: [],
            values: []
        };

        // Clear the sequencing models on the synth
        that.synth.midiNoteSynth.applier.change("inputs.noteSequencer", emptySequence);
        that.synth.pianoEnvelopeSynth.applier.change("inputs.envelopeSequencer", emptySequence);

        // Stop any queued voices
        if (that.isTextToSpeechSupported) {
            that.textToSpeech.cancel();
        }

        // Stop the flocking environment
        flockingEnvironment.stop();

        // Update the model information about play state
        that.applier.change("isPlaying", false);
        that.applier.change("currentlyPlayingData", null);

        // Fire the stop event
        that.events.onSonificationStopped.fire();
    };

})(jQuery, fluid);
