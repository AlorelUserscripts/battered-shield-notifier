const sfx = require('./sfx').notification;

module.exports = (msg, options) => {
    console.debug(`Notifying: ${msg}`);
    options = $.extend(
        {text: msg, timeout: 15000, sound: true},
        options || {}
    );

    GM_notification(options);

    if (options.sound) {
        sfx.play();
    }
};