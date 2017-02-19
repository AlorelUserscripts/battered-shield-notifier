const notify = require('../notify');
const model = require('../model').model;
const options = {timeout: 30000};

model.hpPCT.subscribe(v => {
    const threshold = model.notify_HP_pct();
    if (threshold > 0 && v >= threshold) {
        notify(`HP at ${v}%!`, options);
    }
});