const debug = function (v) {
    console.debug({
        name: this.toString(),
        value: v
    });
};

let observables = {
    apPCT: ko.observable(0),
    timer: ko.observable(0),
    hpPCT: ko.observable(0),
    captcha: ko.observable(false)
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

unsafeWindow.batteredShieldHelper = {
    get debug() {
        let out = {};

        for (let k of Object.keys(observables)) {
            out[k] = observables[k]();
        }

        return out;
    }
};