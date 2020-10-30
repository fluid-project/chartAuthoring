#! /usr/bin/env node

/*
Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/fluid-project/first-discovery-server/raw/master/LICENSE.txt
*/

/* eslint-env node */
"use strict";

var path = require("path");
var configPath = path.join(__dirname, ".eslintrc.json");

module.exports = require(configPath);
