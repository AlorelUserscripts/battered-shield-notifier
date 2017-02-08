const stopped = 'Stopped';
const notify = require('../notify');
const model = require('../model').model;

model.timer.subscribe(v => {
    if (stopped == v && model.notify_timer()) {
        notify(`Actions finished: ${v}`);
    }
});