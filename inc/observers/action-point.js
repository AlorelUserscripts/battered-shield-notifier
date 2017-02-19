const node = document.querySelector(".attrib_value.ap_data");
const model = require('../model').model.apPCT;
const regex = require('../x-out-of-y');

new MutationObserver(() => {
    const match = node.textContent.trim().match(regex);

    if (match) {
        model(parseFloat(match[1]) / parseFloat(match[2]) * 100.0);
    }
}).observe(node, require('./settings.json'));