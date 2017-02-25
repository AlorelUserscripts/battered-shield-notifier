// Credit: https://jsfiddle.net/ripper234/Xv9WL/28/

const isPositiveInteger = (x) => {
    // http://stackoverflow.com/a/1019526/11236
    return /^\d+$/.test(x);
};

module.exports = (v1, v2) => {
    let v1parts = v1.split('.');
    let v2parts = v2.split('.');

    // First, validate both numbers are true version numbers
    function validateParts(parts) {
        for (let i = 0; i < parts.length; ++i) {
            if (!isPositiveInteger(parts[i])) {
                return false;
            }
        }
        return true;
    }

    if (!validateParts(v1parts) || !validateParts(v2parts)) {
        return NaN;
    }

    for (let i = 0; i < v1parts.length; ++i) {
        if (v2parts.length === i) {
            return 1;
        }

        if (v1parts[i] === v2parts[i]) {
            continue;
        }
        if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        return -1;
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
};