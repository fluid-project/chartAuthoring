# eslint-config-fluid
fluid-project eslint configuration

## Using ##

To use the eslint configuration provided by this module add it as a dev dependency

```bash
npm install eslint-config-fluid --save-dev
```

and add an `extends` property to your .eslintrc.json file.

```json
{
    "extends": "eslint-config-fluid"
}
```

## Developing ##

See the eslint [sharable configs](http://eslint.org/docs/developer-guide/shareable-configs) documentation for full details.

### Modifying Configuration ###

To modify the eslint rules provided by this module, update the configuration in the [.eslintrc.json](.eslintrc.json) file.
See the eslint [user-guide](http://eslint.org/docs/user-guide/configuring) for configuration options.

### Testing ###

To test your changes locally, link the package globally on your system.

```bash
# run from the eslint-config-fluid directory.
# depending on your system, you may need to use sudo
npm link
```

Add your linked module to the package you want to test in.
```bash
# in the root directory for the package you want to test the configuration with
npm link eslint-config-myconfig
```

Remove the links to clean up the test settings.

```bash
# run from the eslint-config-fluid directory.
# depending on your system, you may need to use sudo
npm unlink

# in the root directory for the package you tested the configuration with
npm unlink eslint-config-fluid

# run the install again to ensure that all the dependencies are properly installed
npm install
```
