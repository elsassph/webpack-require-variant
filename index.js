'use strict';

const fs = require('fs');

function isEmpty(s) {
    return s == null || s.length == 0;
}
function endsWith(s, t) {
    const p = s.lastIndexOf(t);
    return p > 0 && p == s.length - t.length;
}
function replaceExtension(s, t, r) {
    const p = s.lastIndexOf(t);
    return s.substr(0, p) + r;
}

function installFilter(compiler, extension, variant, includeNodeModules) {
    const ending = variant + extension;
    
    compiler.resolvers.normal.plugin("file", function(request, callback) {
        if ((includeNodeModules || request.path.indexOf('node_module') < 0) 
            && endsWith(request.path, extension) > 0) {
            
            const altPath = replaceExtension(request.path, extension, ending);
            if (fs.existsSync(altPath)) {
                request.path = altPath;
            }
        }
        callback();
    });
}

/**
 * Customize file resolver to require alternate files if available:
 * 
 *     new RequireVariant(['.js', '.jsx'], '.foo')  // a.js -> a.foo.js, a.jsx -> a.foo.jsx
 *     new RequireVariant(['.tsx'], '_cordova')     // b.tsx -> b_cordova.tsx
 */
class RequireVariantPlugin {

    constructor(extensions, variant, includeNodeModules) {
        this.extensions = extensions;
        this.variant = variant;
        this.includeNodeModules = !!includeNodeModules;
        this.enabled = !isEmpty(variant) && !isEmpty(extensions);
        if (this.enabled) {
            console.log(`Require variant ${variant} for files ending with ${extensions}\n`);
        }
    }

    apply(compiler) {
        if (!this.enabled) return;

        for (var i = 0; i < this.extensions.length; i++) {
            installFilter(compiler, this.extensions[i], this.variant, this.includeNodeModules);
        }
    }
}

module.exports = RequireVariantPlugin;
