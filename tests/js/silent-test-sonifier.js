/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function () {
    "use strict";

    fluid.defaults("floe.tests.chartAuthoring.sonifier", {
        gradeNames: ["floe.chartAuthoring.sonifier"],

        components: {
            enviro: {
                type: "flock.silentEnviro"
            }
        }
    });
}());
