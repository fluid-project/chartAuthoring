/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy", {
        // can override these to control sonification behaviour
        // These need better explanations of what they do
        sonificationOptions: {
            strategies: {
                unitDivisor: {
                    config: {
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
        invokers: {
            "sonifyData": {
                funcName: "floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.dataEntriesToSonificationData",
                args: "{that}"
            },
            "unitDivisor10xSonificationStrategy": {
                funcName: "floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.unitDivisorStrategy",
                args: ["{that}", 10]
            },
            "unitDivisor5xSonificationStrategy": {
                funcName: "floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.unitDivisorStrategy",
                args: ["{that}", 5]
            },
            "unitDivisor1xSonificationStrategy": {
                funcName: "floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.unitDivisorStrategy",
                args: ["{that}", 1]
            }
        }
    });

    // Given an object in the style of floe.chartAuthoring.dataEntryPanel.model.dataEntries,
    // convert it to an array of objects in the style used by the sonification components,
    // maintaining object constancy by using the dataEntry object name as the key
    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.dataEntriesToSonificationData = function (that) {
        var sonificationData = that.defaultSonificationStrategy();
        that.applier.change("sonifiedData", sonificationData);
    };

    // Creates a sonified data set based on unit divisors
    // Longer tones represent the unit divisor, while a short tones is played
    // for each remaining "1" of the remainder
    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.unitDivisorStrategy = function (that, unitDivisor) {
        var dataSet = that.model.dataSet;

        var totalValue = that.model.total.value;
        var sonificationData = [];
        var sonificationOptions = that.options.sonificationOptions;
        var playbackOptions = that.options.playbackOptions;

        var noteDurationConfig = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.applyZoomToDurationConfig(sonificationOptions.strategies.unitDivisor.config.notes.durations.play, playbackOptions.zoom),
            noteValueConfig = sonificationOptions.strategies.unitDivisor.config.notes.values,
            envelopeDurationConfig = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.applyZoomToDurationConfig(sonificationOptions.strategies.unitDivisor.config.envelope.durations, playbackOptions.zoom),
            envelopeValuesConfig = sonificationOptions.strategies.unitDivisor.config.envelope.values;

        fluid.each(dataSet, function (item, key) {
            if (item.value !== null) {
                var percentage = Number(floe.chartAuthoring.percentage.calculate(item.value, totalValue).toFixed(0));
                var units = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getDivisorStrategyUnits(percentage, unitDivisor);
                var noteDurations = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getConfigByDivisor(units, unitDivisor, noteDurationConfig);
                var noteValues = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getConfigByDivisor(units, unitDivisor, noteValueConfig);
                var envelopeDurations = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getSonificationEnvelopeDurationsByDivisor(units, unitDivisor, envelopeDurationConfig);
                var envelopeValues = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getSonificationEnvelopeValuesByDivisor(envelopeDurations, envelopeDurationConfig, envelopeValuesConfig);
                var d = {
                    id: key,
                    label: item.label,
                    value: item.value,
                    percentage: percentage,
                    units: units,
                    notes: {
                        durations: noteDurations,
                        values: noteValues,
                        totalDuration: floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getTotalDuration(noteDurations)
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
    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getTotalDuration = function (durationsArray) {
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
    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getDivisorStrategyUnits = function (value, unitDivisor) {
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
    // such as the one produced by floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getDivisorStrategyUnits
    // and a config, returns an array with those divisor and remainder
    // values translated into the equivalent units required for sonification
    //
    // Used to generate value and duration configs
    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getConfigByDivisor = function (units, unitDivisor, config) {
        var collection = fluid.transform(units, function (unit) {
            return config[unit === unitDivisor ? "divisorReturnValue" : "remainderReturnValue"];
        });
        return collection;
    };

    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getSonificationEnvelopeDurationsByDivisor = function (units, unitDivisor, envelopeDurationConfig) {
        var playDurations = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getConfigByDivisor(units, unitDivisor, envelopeDurationConfig.play);

        var silenceDurations = floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getConfigByDivisor(units, unitDivisor, envelopeDurationConfig.silence);

        return floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.interleaveTransform(playDurations, silenceDurations);
    };

    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.getSonificationEnvelopeValuesByDivisor = function (envelopeDurations, envelopeDurationConfig, envelopeValuesConfig) {

        var isDurationMatchesPlayValue = function (duration) {
            return duration === envelopeDurationConfig.play.divisorReturnValue || duration === envelopeDurationConfig.play.remainderReturnValue;
        };

        return  floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.truthValueTransform(envelopeDurations, isDurationMatchesPlayValue, envelopeValuesConfig.openValue, envelopeValuesConfig.closedValue);
    };

    // Given an array of values, a truthFunction and values to return when the
    // truth function is true or false, return another array of values based on
    // testing each value in the original array
    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.truthValueTransform = function (valueArray, truthFunction, trueValue, falseValue) {
        var transformedArray = fluid.transform(valueArray, function (value) {
            var testedValue = truthFunction(value) ? trueValue : falseValue;
            return testedValue;
        });
        return transformedArray;
    };


    // Given two arrays, interleaves them together, starting with the first item of array1
    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.interleaveTransform = function (array1, array2) {
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

    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.multiplierTransform = function (object, multiplier) {
        if (fluid.isPlainObject(object)) {
            var transformed = fluid.transform(object, function (v) {
                    return floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.multiplierTransform(v, multiplier);
                });
            return transformed;
        } else {
            return typeof object === "number" ? object * multiplier : object;
        }
    };

    // Get the sonificationOptions with a zoom factor applied to the durations
    floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.applyZoomToDurationConfig = function (durationConfig, zoom) {
        var zoomedNoteDurationConfig = fluid.transform(durationConfig, function (duration) {
            return floe.chartAuthoring.sonifier.unitDivisorSonificationStrategy.multiplierTransform(duration, zoom);
        });
        return zoomedNoteDurationConfig;
    };

})(jQuery, fluid);
