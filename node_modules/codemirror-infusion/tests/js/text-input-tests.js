/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./fixtures");

fluid.defaults("fluid.tests.codeMirror.textInput.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    testHtmlFile: "%codemirror-infusion/tests/content/keyboard-navigation/no-other-focusable.html",
    rawModules: [{
        name: "Testing text input...",
        tests: [
            {
                name: "Navigate to and enter text in the editor...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.testHtmlFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [gpii.webdriver.Key.TAB, "xxx"]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "editor.getContent"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The content should have been entered...", "xxx", "{arguments}.0"] // message, element, selected
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.codeMirror.textInput.testEnvironment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.codeMirror.textInput.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.codeMirror.textInput.testEnvironment"});
