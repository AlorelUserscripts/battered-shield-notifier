const srcFile = "battered-shield-helper.src.js";
const metaFile = "battered-shield-helper.meta.js";
const userscriptFile = "battered-shield-helper.user.js";

console.time("build");

const browserify = require('browserify');
const path = require('path');
const fs = require('fs');

require('userscript-utils').getUpdateMetablock.fromFile(
    path.join(__dirname, srcFile),
    (e, data) => {
        if (e) throw e;
        fs.writeFile(path.join(__dirname, metaFile), data + '\n', 'utf8', (e) => {
            if (e) throw e;
        })
    },
    true,
    true
);

browserify({entries: path.join(__dirname, srcFile)})
    .transform('babelify',
        {
            presets: ['babel-preset-latest']
        }
    )
    .bundle((e, r) => {
        if (e)throw e;
        console.timeEnd("build");
    })
    .pipe(fs.createWriteStream(path.join(__dirname, userscriptFile)));