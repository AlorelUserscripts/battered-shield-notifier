const stopped = 'Stopped';
const notify = require('../notify');

require('../model').model.timer.subscribe(v => {
    if (stopped === v) {
        notify(`Actions finished: ${v}`);
    }
});