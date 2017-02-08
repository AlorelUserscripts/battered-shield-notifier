const string = (key, def) => {
    const r = ko.observable(GM_getValue(key, def || ""));
    r.subscribe(v => GM_setValue(key, v));
    return r;
};
const boolean = (key, def) => {
    const r = ko.observable(1 == GM_getValue(key, def));
    r.subscribe(v => GM_setValue(key, v ? 1 : 0));
    return r;
};

module.exports = {string, boolean};