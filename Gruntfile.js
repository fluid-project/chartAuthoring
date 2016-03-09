/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

// Declare dependencies
/* global module */

module.exports = function (grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        // Project package file destination.
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: ["**/*.js"],
            buildScripts: ["Gruntfile.js"],
            options: {
                jshintrc: true
            }
        },
        jsonlint: {
            all: ["package.json", ".jshintrc", "src/js/*.json", "tests/**/*.json", "demos/**/*.json"]
        },
        copy: {
            // Copy external front end dependencies into appropriate directories
            frontEndDependencies: {
                files: [
                    // D3
                    {expand: true, cwd: "./node_modules/d3/", src: "**", dest: ".//src/lib/ext/d3/"},
                    // Flocking
                    {expand: true, cwd: "./node_modules/flocking/", src: "**", dest: "./src/lib/ext/flocking/"}
                ]
            }
        }
    });

    // Load the plugin(s):
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-contrib-copy");

    // Custom tasks:

    grunt.registerTask("default", ["lint"]);
    grunt.registerTask("lint", "Apply jshint and jsonlint", ["jshint", "jsonlint"]);
};
