const debug = function (v) {
    console.debug({
        name: this.toString(),
        value: v
    });
};
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

let addListeners = [];

for (let k of Object.keys(observables)) {
    observables[k].subscribe(debug, k);
}

module.exports = {
    add: (name, value) => {
        observables[name] = value;
        value.subscribe(debug, name);

        if (addListeners.length) {
            for (let listener of addListeners) {
                listener(name, value);
            }
        }

        return module.exports;
    },
    get model() {
        return observables;
    },
    addListener: listener => {
        if (typeof listener === "function") {
            addListeners.push(listener);
        } else {
            throw new TypeError("Listener must be a function");
        }
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