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

    fluid.defaults("floe.chartAuthoring.sonifier", {
        gradeNames: ["floe.chartAuthoring.totalRelaying", "floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy"],
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
            enviro: {
                type: "flock.enviro"
            },
            synth: {
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
            // Calls the default sonification strategy
            "defaultSonificationStrategy": "{that}.unitDivisorStrategy(10)"
        },
        events: {
            // Fires when a sonification play is requested
            onSonificationRequested: null,
            // Fires after sonification data is queued for play
            onSonificationDataQueued: null,
            // Fires when a voice label read finishes (via event injection),
            // or is fired manually by the floe.chartAuthoring.sonifier.scheduleNextPlayData
            // function
            onVoiceLabelCompleted: "{textToSpeech}.events.onStop",
            // Fires when stopSonification function is called
            onSonificationStopped: null
        },
        listeners: {
            "onSonificationRequested.startEnviro": {
                func: "{that}.enviro.start"
            },
            "onSonificationRequested.queueData": {
                funcName: "floe.chartAuthoring.sonifier.addToSonificationQueue",
                args: ["{that}"],
                priority: "after:onSonificationRequested.startEnviro"
            },
            "onVoiceLabelCompleted.playDataAndQueueNext": "{that}.playDataAndQueueNext"
        }
    });

    // Adds sonifiedData to the queue, but only if something isn't currently
    // playing
    floe.chartAuthoring.sonifier.addToSonificationQueue = function (that) {
        // Don't add to the queue if sound is currently playing
        if (that.model.isPlaying) {
            return;
        }
        that.applier.change("sonificationQueue", that.model.sonifiedData);
        that.events.onSonificationDataQueued.fire();
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
        var noteDuration = fluid.get(data, "notes.totalDuration") || 0;

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
        that.enviro.stop();

        // Update the model information about play state
        that.applier.change("isPlaying", false);
        that.applier.change("currentlyPlayingData", null);

        // Fire the stop event
        that.events.onSonificationStopped.fire();
    };

})(jQuery, fluid);
