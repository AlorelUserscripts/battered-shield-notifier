const gmo = require('./gm-observable');
const uuid = require('./uuid');
const notify = require('./notify');

const observables = {
    notify_HP: gmo.boolean('notify_hp', true), //todo remove
};

const defaultAddOptions = {
    hide: false,
    subscribe: true
};

const eventSubscriptionCallback = function (val) {
    const evt = new CustomEvent(`battered-shield-helper.${this}`, {detail: val});
    document.dispatchEvent(evt);
};

const add = (name, value, options) => {
    options = $.extend({}, defaultAddOptions, options || {});
    Object.defineProperty(observables, name, {
        configurable: false,
        writable: false,
        enumerable: !options.hide,
        value
    });
    if (options.subscribe) {
        value.subscribe(eventSubscriptionCallback, name);
    }

    return module.exports;
};

add('apPCT', ko.observable(0));
add('timer', ko.observable(0));
add('hpPCT', ko.observable(0));
add('captcha', ko.observable(false));

add('notify_captcha', gmo.boolean('notify_captcha', true));
add('notify_timer', gmo.boolean('notify_timer', true));

add('notify_AP_pct', gmo.integer('notify_ap_pct', 100));
add('notify_HP_pct', gmo.integer('notify_hp_pct', 75));

module.exports = {
    add,
    addInternal: (value, options) => {
        while (true) {
            try {
                const name = '_' + uuid();
                add(name, value, $.extend({subscribe: false, hide: true}, options || {}));
                return name;
            } catch (e) {

            }
        }
    },
    get model() {
        return observables;
    },
    ready: {
        skillLevels: require('./get-levels')().then(levels => {
            for (let skill of Object.keys(levels)) {
                let lvl = ko.observable(levels[skill]),
                    notifyAt = gmo.integer(`notify_at_lvl_${skill}`, 0);

                add(`lvl_${skill}`, lvl);
                add(`notify_at_lvl_${skill}`, notifyAt);
                add(`lvl_should_notify_${skill}`, ko.pureComputed(() => notifyAt() > 0 && lvl() >= notifyAt()));
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
    notify('See the console', {timeout: 5000});
});