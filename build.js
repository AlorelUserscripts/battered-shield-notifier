var join = require('path').join;

var b = require('userscript-utils')
    .getUpdateMetablock.fromFileSync(join(__dirname, 'battered-shield-helper.user.js'), true, true);

require('fs').writeFileSync(join(__dirname, 'battered-shield-helper.meta.js'), b + '\n', 'utf8');