/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/chartAuthoring/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.chartAuthoring.transforms");

    // similar to fluid.transforms.stringToNumber except that it returns null
    // for invalid parameters including ""
    fluid.defaults("floe.chartAuthoring.transforms.stringToNumber", {
        gradeNames: ["fluid.standardTransformFunction"]
    });

    floe.chartAuthoring.transforms.stringToNumber = function (value) {
        var newValue = parseFloat(value);
        return isNaN(newValue) ? null : newValue;
    };

    fluid.defaults("floe.chartAuthoring.transforms.percentage", {
        gradeNames: ["fluid.standardOutputTransformFunction"]
    });

    floe.chartAuthoring.transforms.percentage = function (transformSpec) {
        return floe.chartAuthoring.percentage.calculate(transformSpec.value, transformSpec.total);
    };

    fluid.defaults("floe.chartAuthoring.transforms.reduce", {
        gradeNames: ["fluid.standardOutputTransformFunction"]
    });

    floe.chartAuthoring.transforms.reduce = function (transformSpec) {
        var values = transformSpec.value;
        var extractor = transformSpec.extractor || "fluid.identity";

        if (fluid.isPlainObject(values) && !fluid.isArrayable(values)) {
            values = fluid.values(values);
        }

        return fluid.accumulate(values, function (value, currentValue) {
            value = fluid.invokeGlobalFunction(extractor, [value]);

            if (fluid.isValue(value) && !isNaN(value)) {
                return fluid.invokeGlobalFunction(transformSpec.func, [value, currentValue]);
            } else {
                return currentValue;
            }

        }, transformSpec.initialValue);
    };

    floe.chartAuthoring.transforms.reduce.add = function (value, currentValue) {
        return value + (currentValue || 0);
    };

    floe.chartAuthoring.transforms.reduce.valueExtractor = function (obj) {
        return obj.value;
    };

})(jQuery, fluid);
