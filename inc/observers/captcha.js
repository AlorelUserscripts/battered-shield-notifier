const $node = $(".PopupCaptcha");
const model = require('../model').model.captcha;

new MutationObserver(() => {
    model($node.is(":visible"));
}).observe($node[0], require('./settings.json'));