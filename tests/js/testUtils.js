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

    fluid.registerNamespace("floe.tests.utils");

    floe.tests.utils.triggerChangeEvent = function (elm, value) {
        elm = $(elm);
        elm.val(value);
        elm.change();
    };

    floe.tests.utils.matrixTest = function (inputs, testFn) {
        fluid.each(inputs, function (row, rowIdx) {
            fluid.each(inputs, function (col, colIdx) {
                testFn(col, row, colIdx, rowIdx);
            });
        });
    };

    // A component for running tests that need variables loaded
    // from an external JSON file, but that don't otherwise
    // need asynchronous testing
    fluid.defaults("floe.tests.utils.JSONFixtureTester", {
        gradeNames: ["fluid.component"],
        testOptions: {
            // A set of fixture JSON files to load
            // data from each JSON file ends up stored in {that}.fixtureData
            // by the same key, FE from the example below we get:
            // {that}.fixtureData.dataSet1
            fixtureFiles: {
                // dataSet1: "../json/dataSet1.json",
                // dataSet2: "../json/dataSet2.json"
            }
        },
        // Fired when all fixture files are loaded; ready to run any tests
        // that need the data stored in them
        // tests using this component should listen for this event with a
        // wrapper function or similar that passes in the component so the
        // fixture data can be used
        events: {
            onAllFixturesLoaded: null
        },
        listeners: {
            "onCreate.loadJSONFixtures": {
                func: "floe.tests.utils.JSONFixtureTester.loadJSONFixtures",
                args: "{that}"
            }
            // example test wrapping function
            // "onAllFixturesLoaded.runFixtureBasedTests": {
            //     func: "floe.tests.utils.fixtureBaedTestWrapper",
            //     args: "{that}"
            // }
        }
    });

    // Creates the {that}.fixtureData structure
    floe.tests.utils.JSONFixtureTester.loadJSONFixtures = function (that) {
        var fixturesArray = fluid.hashToArray(that.options.testOptions.fixtureFiles, "key", function (newElem, oldElem) {
            newElem.url = oldElem;
        });
        // Initial fixture data object
        that.fixtureData = {};
        floe.tests.utils.JSONFixtureTester.recursiveFixtureLoader(fixturesArray, that);
    };

    // Recursively processes an array of fixture data file paths, add them
    // to the fixtureData object, and fire the onAllFixturesLoaded when
    // the array is empty
    floe.tests.utils.JSONFixtureTester.recursiveFixtureLoader = function (fixturesArray, that) {
        var currentFixture = fixturesArray.shift();
        $.getJSON(currentFixture.url, function (data) {
            that.fixtureData[currentFixture.key] = data;
            if (fixturesArray.length > 0) {
                floe.tests.utils.JSONFixtureTester.recursiveFixtureLoader(fixturesArray, that);
            } else {
                that.events.onAllFixturesLoaded.fire();
            }
        });
    };

})(jQuery, fluid);
