/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("kettle");

require("gpii-express");

require("gpii-webdriver");
gpii.webdriver.loadTestingSupport();

// An extension of the standard webdriver test environment that explicitly fails if there are browser errors.
fluid.defaults("fluid.test.codeMirror.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        webdriver: {
            options: {
                listeners: {
                    "onError.fail": {
                        funcName: "fluid.fail",
                        args: ["BROWSER ERROR:", "{arguments}.0"]
                    }
                }
            }
        }
    }
});
