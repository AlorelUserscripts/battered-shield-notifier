const node = document.querySelector(".timer_plaque");
const model = require('../model').model.timer;

new MutationObserver(() => {
    const text = node.textContent.trim();
    model(isNaN(text) ? text : parseFloat(text));
}).observe(node, require('./settings.json'));