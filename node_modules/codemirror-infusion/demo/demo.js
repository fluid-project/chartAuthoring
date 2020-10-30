/*! Demo for CodeMirror components for Fluid Infusion
 *  Copyright 2015, Colin Clark
 *  Copyright 2015, Antranig Basman
 *  Dual licensed under the MIT and GPL Version 2 licenses.
 */

/*global fluid, demo*/

(function () {
    "use strict";
    fluid.defaults("demo.lintingCodeMirror.holder", {
        gradeNames: "fluid.component",
        components: {
            codeMirror: {
                type: "demo.lintingCodeMirror",
                container: "#editor"
            },
            binder: {
                type: "demo.contentTypeBinder",
                container: "#content-type"
            }
        }
    });

    fluid.defaults("demo.contentTypeBinder", {
        gradeNames: "fluid.viewComponent",
        selectors: {
            select: "select"
        },
        listeners: {
            "onCreate.bind": "demo.contentTypeBinder.bind({that})"
        },
        model: {
            contentType: "{lintingCodeMirror}.model.codeMirrorOptions.mode"
        }
    });

    demo.contentTypeBinder.bind = function (parent) {
        var select = parent.locate("select");
        // One year we will have a renderer
        select.change(function () {
            parent.applier.change("contentType", select.val());
        });
        select.val(parent.model.contentType);
        parent.applier.modelChanged.addListener("contentType", function (value) {
            select.val(value);
        });
    };


    fluid.defaults("demo.lintingCodeMirror", {
        gradeNames: "fluid.lintingCodeMirror",
        mergePolicy: {
            value: "noexpand"
        },
        mode: "application/json5",
        autoCloseBrackets: true,
        matchBrackets: true,
        smartIndent: true,
        theme: "monokai",
        indentUnit: 4,
        tabSize: 4,
        lineNumbers: true,
        gutters: ["CodeMirror-lint-markers"],
        autofocus: true,
        value: "{\n    \"cat\": {\n        \"says\": \"meow!\"\n    }\n}\n",
        codeMirrorOptions: {
            value: true
        }
    });
}());
    