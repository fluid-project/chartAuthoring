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
        eslint: {
            all: ["src/**/*.js", "tests/**/*.js", "demos/**/*.js", "examples/**/*.js", "*.js"]
        },
        jsonlint: {
            all: ["package.json", ".jshintrc", "src/**/*.json", "tests/**/*.json", "demos/**/*.json", "!node_modules", "!src/lib/**", "!tests/lib/**"]
        },
        copy: {
            // Copy external front end dependencies into appropriate directories
            frontEndDependencies: {
                files: [
                    // D3
                    {expand: true, cwd: "./node_modules/d3/", src: "**", dest: "./src/lib/d3/"},
                    // Flocking
                    {expand: true, cwd: "./node_modules/flocking/", src: "**", dest: "./src/lib/flocking/"},
                    // Infusion distribution files
                    {expand: true, cwd: "./node_modules/infusion/dist", src: "**", dest: "./src/lib/infusion/dist"},
                    // Infusion source
                    {expand: true, cwd: "./node_modules/infusion/src", src: "**", dest: "./src/lib/infusion/src"},
                    // Infusion testing framework
                    {expand: true, cwd: "./node_modules/infusion/tests", src: "**", dest: "./tests/lib/infusion"}
                ]
            }
        }
    });

    // Load the plugin(s):
    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-exec");

    // Custom tasks:

    grunt.registerTask("default", ["lint"]);
    grunt.registerTask("lint", "Apply eslint and jsonlint", ["eslint", "jsonlint"]);
    grunt.registerTask("installFrontEnd", "Install front-end dependencies from the node_modules directory after 'npm install'", ["copy:frontEndDependencies"]);
};
