const notify = require('../notify');

require('../model').model.hpPCT.subscribe(v => {
    if (v >= 100.0) {
        notify('HP full!');
    }
});