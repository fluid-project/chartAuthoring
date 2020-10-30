/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./fixtures");

fluid.defaults("fluid.tests.codeMirror.keyboardNavigation.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    nextFocusableFile:    "%codemirror-infusion/tests/content/keyboard-navigation/next-focusable.html",
    prevFocusableFile:    "%codemirror-infusion/tests/content/keyboard-navigation/prev-focusable.html",
    noOtherFocusableFile: "%codemirror-infusion/tests/content/keyboard-navigation/no-other-focusable.html",
    rawModules: [{
        name: "Testing keyboard navigation...",
        tests: [
            {
                name: "Focus on the editor...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.noOtherFocusableFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fnName: "sendKeys", args: [[gpii.webdriver.Key.TAB]]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "#editor textarea"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.testElementSelected",
                        args:     ["The editor should be selected...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            },
            {
                name: "Leave the editor when there is a next element to focus on...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.nextFocusableFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [[gpii.webdriver.Key.TAB, gpii.webdriver.Key.ESCAPE]]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.testElementSelected",
                        args:     ["The next focusable element should be selected...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            },
            {
                name: "Leave the editor when there is an earlier element in the body to focus on...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.prevFocusableFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [[gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.ESCAPE]]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.testElementSelected",
                        args:     ["The next focusable element should be selected...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            },
            {
                name: "Attempt to leave the editor when there is no other focusable element...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.nextFocusableFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [[gpii.webdriver.Key.TAB, gpii.webdriver.Key.ESCAPE]]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "#editor textarea"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.testElementSelected",
                        args:     ["Focus should still be on the editor...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.codeMirror.keyboardNavigation.testEnvironment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        webdriver: {
            options: {
                browserOptions: {
                    chrome: {
                        nativeEvents: true
                    }
                }
            }
        },
        caseHolder: {
            type: "fluid.tests.codeMirror.keyboardNavigation.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.codeMirror.keyboardNavigation.testEnvironment"});
