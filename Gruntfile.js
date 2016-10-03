/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

/* eslint-env node */

"use strict";

var resolve = require("fluid-resolve");

module.exports = function (grunt) {
    // The grunt developers do not understand how node's module resolution algorithm works and do not use it
    // to resolve npm modules. See https://github.com/gruntjs/grunt/issues/232 - this function loads the
    // contents of a grunt plugin from wherever npm has put it in the tree, in order to allow a project's
    // grunt tasks to be invoked by projects which depend on it without having to explicitly call npm install on it.
    grunt.loadNpmTasksProperly = function (name) {
        var resolved = resolve.sync(name, {
            // Stupid function require to fake out resolve's algorithm which actually attempts to resolve "main", which does
            // not exist for grunt plugins. Instead we resolve onto the one file we are absolutely sure is there
            packageFilter: function (pkg) {
                pkg.main = "package.json";
                return pkg;
            }
        });
        resolved = resolved.substring(0, resolved.length - "package.json".length);
        grunt.loadTasks(resolved + "/tasks");
    };

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
                    // Infusion
                    {expand: true, cwd: "./node_modules/infusion/build", src: "**", dest: "./src/lib/infusion"},
                    // Infusion testing framework
                    {expand: true, cwd: "./node_modules/infusion/build/tests", src: "**", dest: "./tests/lib/infusion"}
                ]
            }
        },
        exec: {
            infusionInstall: {
                command: "npm install",
                cwd: "./node_modules/infusion"
            },
            infusionBuild: {
                command: "grunt build",
                cwd: "./node_modules/infusion"
            }
        }
    });

    // Load the plugin(s):
    grunt.loadNpmTasksProperly("fluid-grunt-eslint");
    grunt.loadNpmTasksProperly("grunt-jsonlint");
    grunt.loadNpmTasksProperly("grunt-contrib-copy");
    grunt.loadNpmTasksProperly("grunt-exec");

    // Custom tasks:

    grunt.registerTask("default", ["lint"]);
    grunt.registerTask("lint", "Apply eslint and jsonlint", ["eslint", "jsonlint"]);
    grunt.registerTask("installFrontEnd", "Install front-end dependencies from the node_modules directory after 'npm install'", ["exec:infusionInstall", "exec:infusionBuild", "copy:frontEndDependencies"]);
};
