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
        },
        distributeOptions: [{
            source: "{that}.options.cookie.name",
            removeSource: true,
            target: "{that > cookieStore}.options.cookie.name"
        }]
    });

    /**
     * Stores the model in the cookieStore
     */

     floe.chartAuthoring.storeModel.store = function (model, cookieStore) {
         cookieStore.set(model);
     };

     /**
     * Try and retrieve a model from the cookieStore; if present, replace
     * any existing model with the model from the cookie
     */

     floe.chartAuthoring.storeModel.retrieve = function (that, cookieStore) {
         var modelFromCookie = cookieStore.get();
         if(modelFromCookie !== undefined) {
             var changeRequest = {
                 path: "",
                 value: modelFromCookie
             };
             // Clear the existing model
             that.applier.change("","","DELETE");
             // Set the model from the model persisted in the cookie
             that.applier.fireChangeRequest(changeRequest);
         }
     };

})(jQuery, fluid);
