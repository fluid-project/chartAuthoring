/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* global fluid */

(function () {
    "use strict";

    fluid.defaults("floe.tests.chartAuthoring.silentSonifier", {
        gradeNames: ["floe.chartAuthoring.sonifier"],

        components: {
            enviro: {
                type: "flock.silentEnviro"
            },
            textToSpeech: {
                options: {
                    model: {
                        utteranceOpts: {
                            // Speak silently
                            "volume": 0
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("floe.tests.chartAuthoring.speedySonifier", {
        gradeNames: ["floe.tests.chartAuthoring.silentSonifier"],
        components: {
            textToSpeech: {
                options: {
                    model: {
                        utteranceOpts: {
                            // Speak fast so test finishes quicker
                            "rate": 2
                        }
                    }
                }
            }
        },
        playbackOptions: {
            // Play fast so the test finishes quicker
            zoom: 0.50
        }
    });

}());
