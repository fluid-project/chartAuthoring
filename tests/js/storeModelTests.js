(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("floe.tests.chartAuthoring");

    fluid.defaults("floe.tests.chartAuthoring.storeModel", {
        gradeNames: ["floe.chartAuthoring.storeModel"]
    });

    jqUnit.test("Changed model is successfully stored in cookie", function () {
        jqUnit.expect(1);

        var that = floe.tests.chartAuthoring.storeModel({
            cookie: {
                name: "chartAuthoring-test-storeModel"
            },
            model: {
                "showPanel": true
            }
        });

        var changeRequest = {
            path: "",
            value: {"showPanel": false}
        };

        var expectedModel = {
            "showPanel": false
        };

        that.applier.change("","","DELETE");
        that.applier.fireChangeRequest(changeRequest);
        var retrievedModelFromCookie = that.cookieStore.get();

        jqUnit.assertDeepEq("Changed model stored in cookie", expectedModel, retrievedModelFromCookie);
    });

    jqUnit.test("If a model is stored in the cookie, the initial model of a newly-constructed component will be set from it", function () {
        jqUnit.expect(1);

        var that = floe.tests.chartAuthoring.storeModel({
            cookie: {
                name: "chartAuthoring-test-storeModel"
            }
        });

        var changeRequest = {
            path: "",
            value: {"fruit": "raspberries"}
        };

        that.applier.change("","","DELETE");
        that.applier.fireChangeRequest(changeRequest);

        that = floe.tests.chartAuthoring.storeModel({
            cookie: {
                name: "chartAuthoring-test-storeModel"
            }
        });

        var expectedModelFromCookie = {
            "fruit": "raspberries"
        };

        jqUnit.assertDeepEq("Model of a newly-constructed component took model from previously set cookie", expectedModelFromCookie, that.model);

    });

})(jQuery, fluid);
