const notify = require('../notify');
const options = {timeout: 3600000};

require('../model').model.captcha.subscribe(visible => {
    if (visible) {
        notify('Captcha!', options);
    }
});