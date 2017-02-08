const notify = require('../notify');
const options = {timeout: 3600000};
const model = require('../model').model;

model.captcha.subscribe(visible => {
    if (visible && model.notify_captcha()) {
        notify('Captcha!', options);
    }
});