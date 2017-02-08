const notify = require('../notify');
const model = require('../model').model;

model.hpPCT.subscribe(v => {
    if (v >= 100.0 && model.notify_HP()) {
        notify('HP full!');
    }
});