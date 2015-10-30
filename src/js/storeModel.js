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

    fluid.defaults("floe.chartAuthoring.storeModel", {
        gradeNames: ["fluid.modelComponent"],
        components: {
            cookieStore: {
                type: "fluid.prefs.cookieStore",
                options: {
                    cookie: {
                        name: "model"
                    }
                }
            }
        },
        invokers: {
            store: {
                funcName: "floe.chartAuthoring.storeModel.store",
                args: ["{storeModel}.model", "{storeModel}.cookieStore"]
            },
            retrieve: {
                funcName: "floe.chartAuthoring.storeModel.retrieve",
                args: ["{storeModel}", "{storeModel}.cookieStore"]
            }
        },
        modelListeners: {
            "": {
                listener: "{storeModel}.store",
                excludeSource: "init"
            }
        },
        listeners: {
            "onCreate.setModelFromCookie": {
                funcName: "{storeModel}.retrieve",
                priority: "first"
            }
        }
    });

    /**
     * Stores the model in the cookieStore
     */

     floe.chartAuthoring.storeModel.store = function (model, cookieStore) {
         // console.log("floe.chartAuthoring.storeModel.store");
         cookieStore.set(model);
     };

     floe.chartAuthoring.storeModel.retrieve = function (that, cookieStore) {
         var modelFromCookie = cookieStore.get();
         if(modelFromCookie !== undefined) {
            //  console.log("got model from cookie");
            //  console.log(modelFromCookie);
             var changeRequest = {
                 path: "",
                 value: modelFromCookie
             };
             // Clear the existing model first
             that.applier.change("","","DELETE");
             that.applier.fireChangeRequest(changeRequest);
         }
         // console.log("floe.chartAuthoring.storeModel.retrieve");
     };

})(jQuery, fluid);
