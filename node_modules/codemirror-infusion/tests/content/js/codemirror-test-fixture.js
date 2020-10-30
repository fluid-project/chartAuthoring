/*
 *  Client-side text fixture for most of the test cases used in this package.
 *
 *  Copyright 2016, Raising the Floor International
 *  Copyright 2015, Colin Clark
 *  Copyright 2015, Antranig Basman
 *
 *  Dual licensed under the MIT and GPL Version 2 licenses.
 */

/*global fluid*/
(function () {
    "use strict";
    fluid.defaults("fluid.test.codeMirror.lintingCodeMirror", {
        gradeNames: "fluid.lintingCodeMirror",
        mode: "application/json5",
        autoCloseBrackets: true,
        matchBrackets: true,
        smartIndent: true,
        indentUnit: 4,
        tabSize: 4,
        lineNumbers: true,
        gutters: ["CodeMirror-lint-markers"],
        autofocus: false,
        codeMirrorOptions: {
            value: false
        }
    });
})();
