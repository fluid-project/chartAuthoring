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
        var noteDurationConfig = {
            divisorDuration: 0.375,
            remainderDuration: 0.16666667
        };

        var noteValueConfig = {
            divisorValue: 91,
            remainderValue: 90
        };

        var envelopeDurationConfig = {
            divisorDuration: 0.125,
            divisorSilence: 0.25,
            remainderDuration: 0.04166667,
            remainderSilence: 0.0625
        };

        var envelopeValuesConfig = {
            openValue: 1.0,
            closedValue: 0.0
        };

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
                    value: percentage,
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

    floe.chartAuthoring.sonifier.playSonification = function(that) {
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
    };

})(jQuery, fluid);
