/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("floe.tests");



    jqUnit.test("Test ascending sort function", function () {
        var unsorted = [{value: 5}, {value: 8}, {value: 6}, {value: 1}];
        var expectedSorted = [{value: 8},  {value: 6}, {value: 5}, {value: 1}];
        jqUnit.assertDeepEq("Ascending sort function behaving as expected", expectedSorted, unsorted.sort(floe.chartAuthoring.utils.sortAscending));
    });

})(jQuery, fluid);
