const notify = require('../notify');
const model = require('../model');


model.ready.skillLevels.then(levels => {
    let m = model.model;

    const subscription = function (shouldNotify) {
        const skill = this;

        if (shouldNotify) {
            notify(`${skill} has reached the target level of ${m[`notify_at_lvl_${skill}`]()}!`);
            m[`notify_at_lvl_${skill}`](0);
        }
    };

    for (let skill of Object.keys(levels)) {
        m[`lvl_should_notify_${skill}`].subscribe(subscription, skill);
        console.debug({skill, val: m[`lvl_should_notify_${skill}`]()});
    }
    console.debug('Skill level subscriptions initialised');
});