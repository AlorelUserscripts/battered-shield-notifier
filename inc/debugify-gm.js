const orig = {
    setvalue: GM_setValue,
    getvalue: GM_getValue
};

GM_setValue = (key, value) => {
    console.debug({operation: 'set-value', key, value});
    orig.setvalue.call(null, key, value);
};

GM_getValue = (key, defaultReturn) => {
    defaultReturn = defaultReturn || null;
    const returnValue = orig.getvalue.call(null, key, defaultReturn);
    console.debug({operation: 'get-value', key, defaultReturn, returnValue});
    return returnValue;
};