The version of Infusion included in this folder was created using a custom build from the infusion master branch:

https://github.com/fluid-project/infusion

commit#: 2f38c09d733925441f0ff2e6636f8886da8af5ea

```
grunt custom --source=true --include="preferences,overviewPanel,inlineEdit"
```

The following directories were stripped out of the build since they contain code that is included in the infusion-custom.js file or is not required:

* README.md
* ReleaseNotes.md
* src/components/inlineEdit/js
* src/components/inlineEditDependencies.json
* src/components/overviewPanel/js
* src/components/overviewPanel/overviewPanelDependencies.json
* src/components/slidingPanel/
* src/components/tableOfContents/js/
* src/components/tableOfContents/tableOfContentsDependencies.json
* src/components/textToSpeech/
* src/components/textfieldSlider/
* src/framework/core/frameworkDependencies.json
* src/framework/core/js/
* src/framework/enhancement/enhancementDependencies.json
* src/framework/enhancement/js/
* src/framework/preferences/js/
* src/framework/preferences/preferencesDependencies.json
* src/framework/renderer/
* src/lib/fastXmlPull/
* src/lib/jquery/core/
* src/lib/jquery/plugins/
* src/lib/jquery/ui/jQueryUICoreDependencies.json
* src/lib/jquery/ui/jQueryUIWidgetsDependencies.json
* src/lib/jquery/ui/js/
* src/lib/jquery/json/
* src/lib/normalize/normalizeDependencies.json

Additionally, the testing framework from Infusion is used (tests/lib/infusion) and should be updated to a matching version. This directory is a copy of

https://github.com/fluid-project/infusion/tree/master/tests

The following directories were stripped out since they contain code that is not required:

* all-tests.html
* component-tests/
* framework-tests/
* lib/mockjax/
* manual-tests/
* node-tests/
* test-core/testTests/
