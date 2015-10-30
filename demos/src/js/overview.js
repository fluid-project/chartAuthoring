$(document).ready(function () {
    fluid.overviewPanel("#floec-overviewPanel", {
        resources: {
            template: {
                href: "src/html/overviewPanelTemplate-chartAuthoring.html"
            }
        },
        strings: {
            componentName: "Chart Authoring Tool",
            infusionCodeLinkText: "get Chart Authoring",
            titleBegin: "A",
            titleLinkText: "Chart Authoring"
        },
        markup: {
            description: "The Chart Authoring Tool supports the authoring, export and embedding of highly accessible charts. Development of this component is currently in progress and does not represent final state. Eventually, these charts will feature sonified representation of their data in addition to visual display.",
            instructions: "<p>Enter labels and data for your pie chart in the data entry area. The pie chart and its corresponding legend will update each time you update your data.</p>"
        },
        model: {
            showPanel: false
        },
        links: {
            titleLink: "https://github.com/fluid-project/chartAuthoring",
            demoCodeLink: "https://github.com/fluid-project/chartAuthoring/tree/master/demos",
            infusionCodeLink: "https://github.com/fluid-project/chartAuthoring",
            feedbackLink: "mailto:infusion-users@fluidproject.org?subject=Chart Authoring Tool feedback",
            designLink: "https://wiki.fluidproject.org/display/fluid/Sonification+Sketches"
        }
    });
});
