# Require Variant Plugin

Provide custom `require` resolution to conditionally include file variants.

*Compatible with hot-reload: modifying a file variant will reload as expected.*

## The problem

Normally, if you want to require (at build time) a different file depending on some conditions, like an environment variable, you have to write this kind of convoluted code:

```javascript
var Code = null;
if (process.env.FOO) {
    Code = require('./code.foo');
}
else {
    Code = require('./code');
}
```

It's ok if you do it once but if you start heavily relying on it, it becomes a burden. 

## The solution

Use this plugin to allow webpack to resolve the file variant automatically.

Install via npm:

    npm install --save-dev require-variant-webpack-plugin

Update your webpack config:

```javascript
const RequireVariantPlugin = require('require-variant-webpack-plugin');

const useFoo = process.env.FOO;

module.exports = {
  plugins: [
    new RequireVariantPlugin(['.js'], useFoo ? '.foo' : null)
  ]
};
```

The plugin simply hooks to the files resolver and modifies the resolved path if a variant exists. 
Once the path is modified, loaders and features like hot-reload use the variant file as reference.

## Usage

Run webpack with or without environment vars to select the variant:

    # no variant
    npm run dev

    // import 'code.js'
    const Code = require('./code'); 

    # with variant
    FOO=true npm run dev

    // import 'code.foo.js' if exists, or 'code.js'
    const Code = require('./code'); 

## API

```javascript
new RequireVariantPlugin(extensions:string[], variantPostfix:string, includeNodeModules:boolean)
```
- `extensions`: array of strings; file paths are matched to end with one of those,
- `variantPostfix`: string; inserted before the extension in matched file paths,
- `includeNodeModules`: boolean; normally `node_module` is ignored.
