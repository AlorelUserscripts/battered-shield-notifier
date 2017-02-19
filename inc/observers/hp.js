const node = document.querySelector('.attrib_name[title="Hit Points"]').nextElementSibling;
const model = require('../model').model.hpPCT;
const regex = require('../x-out-of-y');

new MutationObserver(() => {
    const match = node.textContent.trim().match(regex);

    if (match) {
        model(parseFloat(match[1]) / parseFloat(match[2]) * 100.0);
    }
}).observe(node, require('./settings.json'));