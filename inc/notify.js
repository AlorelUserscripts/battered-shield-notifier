const sfx = require('./sfx').notification;

module.exports = (msg, options) => {
    console.debug(`Notifying: ${msg}`);
    options = $.extend(
        {text: msg, timeout: 3600000, sound: true, highlight: true},
        options || {}
    );

    GM_notification(options);

    if (options.sound) {
        sfx.play();
    }
};