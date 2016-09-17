# Require Variant Plugin

## The problem

Normally, if you want to require a different file (code or resources) depending on some conditions, like an environment variable, you have to write this kind of convoluted code:

```javascript
var View = null;
if (process.env.DEV) {
    View = require('./view.dev'); // ./view.dev.js
}
else {
    View = require('./view'); // view.js
}
```

or

```javascript
if (process.env.FANCY) {
    require('./styles_fancy.scss');
}
else {
    require('./styles.scss');
}
```


It's ok if you do it once but if you start heavily relying on it, it becomes a burden.

## The solution

Use this plugin to allow webpack to resolve the file variant automatically. 
It allows, from a single codebase, to customize profoundly the output without awkward conditional code.

**Disclaimer:** the caveat is that the custom resolution hides the file you really compile in your project - it may be a source of confusion, so use with care.

### Install via npm:

    npm install --save-dev require-variant-webpack-plugin

### Update your webpack config:

```javascript
const RequireVariantPlugin = require('require-variant-webpack-plugin');

const isDev = process.env.DEV;
const isFancy = process.env.FANCY;

module.exports = {
  plugins: [
    new RequireVariantPlugin(['.js', '.jsx'], isDev ? '.dev' : null),
    new RequireVariantPlugin(['.scss'], isFancy ? '_fancy' : null)
  ]
};
```

The plugin simply hooks to the files resolver and, if a variant exists, modifies the resolved path.

**Everything works as usual:** loaders and features like hot-reload use the variant file as reference.

## Usage

Run webpack with or without environment vars to select the variant:

    # no variant
    npm run build

    const View = require('./view'); // view.js
    require('./styles'); // styles.scss

    # with variant
    FANCY=true npm run dev

    const View = require('./view'); // view.dev.js
    require('./styles'); // styles_fancy.scss

## API

```javascript
new RequireVariantPlugin(extensions:string[], variantPostfix:string, includeNodeModules:boolean)
```
- `extensions`: array of strings; file paths are matched to end with one of those,
- `variantPostfix`: string; inserted before the extension in matched file paths,
- `includeNodeModules`: boolean; normally `node_module` is ignored.
