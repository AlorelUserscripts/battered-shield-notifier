const sfx = require('./sfx').notification;
const defaults = {timeout: 3600000, sound: true, highlight: true};

module.exports = (text, options) => {
    console.debug(`Notifying: ${text}`);
    options = $.extend(
        {text},
        defaults,
        options || {}
    );

    GM_notification(options);

    if (options.sound) {
        sfx.play();
    }
};