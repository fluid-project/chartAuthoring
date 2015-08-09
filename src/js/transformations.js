/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.chartAuthoring.transforms");

    // similar to fluid.transforms.stringToNumber except that it returns null
    // for invalid parameters including ""
    fluid.defaults("gpii.chartAuthoring.transforms.stringToNumber", {
        gradeNames: ["fluid.standardTransformFunction"]
    });

    gpii.chartAuthoring.transforms.stringToNumber = function (value) {
        var newValue = parseFloat(value);
        return isNaN(newValue) ? null : newValue;
    };

    fluid.defaults("gpii.chartAuthoring.transforms.percentage", {
        gradeNames: ["fluid.standardOutputTransformFunction"]
    });

    gpii.chartAuthoring.transforms.percentage = function (transformSpec) {
        return gpii.chartAuthoring.percentage.calculate(transformSpec.value, transformSpec.total);
    };

    fluid.defaults("gpii.chartAuthoring.transforms.reduce", {
        gradeNames: ["fluid.standardOutputTransformFunction"]
    });

    gpii.chartAuthoring.transforms.reduce = function (transformSpec) {
        var values = transformSpec.value;

        if (fluid.isPlainObject(values) && !fluid.isArrayable(values)) {
            values = fluid.values(values);
        }

        return fluid.accumulate(values, function (value, currentValue) {
            return fluid.invokeGlobalFunction(transformSpec.func, [value, currentValue]);
        }, transformSpec.initialValue);
    };

})(jQuery, fluid);
