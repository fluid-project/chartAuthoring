/*
Copyright 2013-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/* eslint-env node */
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            src: ["./src/**/*.js", "./tests/**/*.js", "./*.js"]
        },
        jsonlint: {
            src: ["src/**/*.json", "tests/**/*.json", "demo/**/*.json"]
        }
    });

    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("grunt-jsonlint");

    grunt.registerTask("lint", "Apply eslint and jsonlint", ["eslint", "jsonlint"]);
    grunt.registerTask("default", ["lint"]);
};
