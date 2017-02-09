const integer = (key, def) => {
    // getvalue may return key which is an empty string
    // check for def, see if it's set
    // if all else fails, return 0
    const r = ko.observable(parseInt(GM_getValue(key, def) || def || 0));
    r.subscribe(v => GM_setValue(key, parseInt(v)));
    return r;
};
const boolean = (key, def) => {
    const r = ko.observable(1 == GM_getValue(key, def));
    r.subscribe(v => GM_setValue(key, v ? 1 : 0));
    return r;
};

module.exports = {integer, boolean};