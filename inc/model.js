const gmo = require('./gm-observable');
const toast = require('./toast');

let observables = {
    apPCT: ko.observable(0),
    timer: ko.observable(0),
    hpPCT: ko.observable(0),
    captcha: ko.observable(false),
    notify_AP: gmo.boolean('notify_ap', true),
    notify_HP: gmo.boolean('notify_hp', true),
    notify_captcha: gmo.boolean('notify_captcha', true),
    notify_timer: gmo.boolean('notify_timer', true)
};


const eventSubscriptionCallback = function (val) {
    const evt = new CustomEvent(`battered-shield-helper.${this}`, {detail: val});
    document.dispatchEvent(evt);
};


for (let k of Object.keys(observables)) {
    observables[k].subscribe(eventSubscriptionCallback, k);
}

module.exports = {
    add: (name, value) => {
        observables[name] = value;

        return module.exports;
    },
    get model() {
        return observables;
    },
    ready: {
        skillLevels: require('./get-levels')().then(levels => {
            for (let skill of Object.keys(levels)) {
                let lvl = ko.observable(levels[skill]),
                    notifyAt = gmo.integer(`notify_at_lvl_${skill}`, 0);

                let newObservables = {};

                newObservables[`lvl_${skill}`] = lvl;
                newObservables[`notify_at_lvl_${skill}`] = notifyAt;
                newObservables[`lvl_should_notify_${skill}`] = ko.pureComputed(() => notifyAt() > 0 && lvl() >= notifyAt());
                newObservables[`lvl_should_notify_${skill}_text`] = ko.pureComputed(() => {
                    if (notifyAt() < 1) {
                        return 'Disabled';
                    } else if (notifyAt() <= lvl()) {
                        return 'Reached';
                    } else {
                        return `${notifyAt() - lvl()} to go!`;
                    }
                });
                newObservables[`lvl_should_notify_${skill}_class`] = ko.pureComputed(() => {
                    if (notifyAt() < 1) {
                        return 'active text-muted';
                    } else if (notifyAt() <= lvl()) {
                        return 'success text-success';
                    } else {
                        return `info text-primary`;
                    }
                });

                for (let k of Object.keys(newObservables)) {
                    newObservables[k].subscribe(eventSubscriptionCallback, k);
                }

                Object.assign(observables, newObservables);
            }

            return levels;
        })
    }
};

GM_registerMenuCommand(`Debug ${GM_info.script.name}`, () => {
    let ob = {},
        gm = {};

    for (let k of Object.keys(observables)) {
        ob[k] = observables[k]();
    }

    for (let k of GM_listValues()) {
        gm[k] = GM_getValue(k);
    }

    console.debug({
        observables: ob,
        storage: gm
    });
    toast('See the console');
});