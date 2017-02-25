String.prototype.ucFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
const openChangelog = require('./inc/open-changelog');

document.addEventListener('DOMContentLoaded', () => {
    ['remodal_css1', 'remodal_css2', 'toast_css']
        .map(GM_getResourceText)
        .map(c => $(`<style>${c}</style>`)[0])
        .forEach(c => document.body.appendChild(c));

    $('<style>.remodal-overlay,.remodal-wrapper{z-index:100000}</style>').appendTo(document.body);

    require('./inc/observers/action-point');
    require('./inc/observers/action-timer');
    require('./inc/observers/captcha');
    require('./inc/observers/hp');
    require('./inc/observers/skill-levels');

    require('./inc/subscriptions/action-points');
    require('./inc/subscriptions/actions-finished');
    require('./inc/subscriptions/captcha');
    require('./inc/subscriptions/full-health');
    require('./inc/subscriptions/skill-levels');

    require('./inc/register-menu');

    if (require('./inc/version-compare')(GM_info.script.version, GM_getValue('last_version_used', '0')) > 0) {
        require('./inc/notify')(
            `${GM_info.script.name} has been updated! Click here for the changelog`,
            {onclick: openChangelog}
        );
    }
    GM_setValue('last_version_used', GM_info.script.version);
}, {once: true, passive: true});
GM_registerMenuCommand(`${GM_info.script.name} changelog`, openChangelog);