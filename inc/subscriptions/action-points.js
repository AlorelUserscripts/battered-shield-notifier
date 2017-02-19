const options = {
    timeout: 30000
};
const notify = require('../notify');
const model = require('../model').model;

model.apPCT.subscribe(v => {
    const threshold = model.notify_AP_pct();

    if (threshold > 0 && v >= threshold) {
        notify(`AP is at ${v}%`, options);
    }
});