# Chart Authoring Tool

[![Netlify Status](https://api.netlify.com/api/v1/badges/0d515954-fc3b-4031-bede-f8d645332361/deploy-status)](https://app.netlify.com/sites/build-chartauthoring/deploys)

A tool for authoring accessible charts for the web. Including a sonified (audio) version of the chart.

**WARNING**: This repository is broken and needs more work to update the dependencies so it works with a recent version of Node.js. The current Dockerfile contains build steps that work with the code as-is but it's not recommended for production. An old version of the code has been committed to the `live` branch as a stopgap solution.

## How Do I Get the Chart Authoring Tool

You can checkout and fork the Chart Authoring Tool on github:

[https://github.com/fluid-project/chartAuthoring](https://github.com/fluid-project/chartAuthoring)

## Who Makes the Chart Authoring Tool, and How Can I Help

The Fluid community is an international group of designers, developers, and testers who focus on a common mission: improving the user experience and accessibility of the open web.

The best way to join the Fluid Community is to jump into any of our community activities. Visit our [website](http://fluidproject.org/) for links to our mailing lists, chat room, wiki, etc.

## Building

Requirements:

* npm

Steps:

* `npm install`
  * postinstall should run the `grunt installFrontEnd` task after installation completes

Result:

* The root directory can now serve up the demos and tests as a static site

## Testing

If you have `testem` installed ([details here for installing testem](https://github.com/testem/testem/#installation)), you can run the unit tests with `npm test`.
