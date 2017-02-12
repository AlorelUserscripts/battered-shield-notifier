console.time("build");

const UglifyJS = require("uglify-js");
const Promise = require('bluebird');
const browserify = require('browserify');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const values = require('lodash.values');
const userscriptUtils = require('userscript-utils');

const files = {
    script_src: "battered-shield-helper.src.js",
    script_out: "battered-shield-helper.user.js",
    meta_in: "metablock.txt",
    meta_out: "battered-shield-helper.meta.js"
};

let actions = {};

actions.get_metablock = fs.readFileAsync(path.join(__dirname, files.meta_in), 'utf8');

actions.browserify = new Promise((resolve, reject) => {
    browserify({entries: path.join(__dirname, files.script_src)})
        .transform('babelify',
            {
                "presets": [
                    "stage-3",
                    "stage-2",
                    "stage-1",
                    "stage-0",
                    "latest"
                ],
                "plugins": [
                    "transform-es5-property-mutators"
                ]
            }
        )
        .bundle((e, r) => {
            if (e) reject(e);
            else resolve(r.toString());
        });
});

actions.wrap = actions.browserify.then(js => {
    const vars = [
        "GM_notification",
        "GM_info",
        "GM_getResourceText",
        "GM_registerMenuCommand",
        "GM_getValue",
        "GM_setValue",
        "GM_listValues",
        "buzz",
        "Promise",
        "ko",
        "String",
        "document"
    ].join(",");

    return `(function(${vars}){ko.options.deferUpdates = true;${js}})(${vars})`;
});

actions.uglify = actions.wrap.then(js => UglifyJS.minify(js, {fromString: true}).code);

actions.concat_metablock_and_script = Promise.all([actions.get_metablock, actions.uglify])
    .spread((metablock, script) => `${metablock}\n${script}`);

actions.write_out_script = actions.concat_metablock_and_script.then(str => {
    return fs.writeFileAsync(path.join(__dirname, files.script_out), str + '\n', 'utf8');
});

actions.stringify_upadate_block = actions.get_metablock.then(str => {
    return new Promise((resolve, reject) => {
        userscriptUtils.getUpdateMetablock.fromString(str, (e, metablock) => {
            if (e) reject(e);
            else resolve(metablock);
        }, true, true)
    })
});

actions.save_meta_js = actions.stringify_upadate_block.then(str => {
    return fs.writeFileAsync(path.join(__dirname, files.meta_out), str + "\n", 'utf8');
});

//Finish timer
Promise.all(values(actions)).then(() => {
    console.timeEnd("build")
});