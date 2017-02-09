// ==UserScript==
// @name         Battered shield helper
// @namespace    https://github.com/AlorelUserscripts/battered-shield-notifier
// @version      0.3
// @description  Helps with your battered shields
// @author       Alorel
// @include      /^https?:\/\/(?=www\.)?batteredshield\.com\/game\/?/
// @homepage     https://github.com/AlorelUserscripts/battered-shield-notifier
// @supportURL   https://github.com/AlorelUserscripts/battered-shield-notifier/issues
//
// @downloadURL  https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/master/battered-shield-helper.user.js
// @updateURL    https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/master/battered-shield-helper.meta.js
//
// @icon64       https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/3cad641d61497ba25be33ae9db0ef30742628452/assets/icon-64.png
// @icon         https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/3cad641d61497ba25be33ae9db0ef30742628452/assets/icon-32.png
//
// @run-at       document-start
//
// @grant        GM_notification
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
//
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js
// @require      https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/0242848a5d5c34368d81582051dd051b6a11ee70/lib/buzz.min.js
// @require      https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/0242848a5d5c34368d81582051dd051b6a11ee70/lib/knockout.min.js
// @require      https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/44d6524c94a9fd58a1c8c63909debbbcbe00ba8d/lib/jquery.toast.min.js
// @require      https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/122625d19ee42648bf181dd20715c4fd349c273e/lib/bluebird.min.js

// @require  https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/63cb7a7b1087226c1e138c687dc58f2b9f9f531e/lib/remodal.min.js
//
// @resource toast_css https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/44d6524c94a9fd58a1c8c63909debbbcbe00ba8d/lib/jquery.toast.min.css
// @resource remodal_css1 https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/63cb7a7b1087226c1e138c687dc58f2b9f9f531e/lib/remodal.css
// @resource remodal_css2 https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/63cb7a7b1087226c1e138c687dc58f2b9f9f531e/lib/remodal-default-theme.css
// @resource bs_css1 https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
// @resource bs_css2 https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css
// ==/UserScript==

require('./inc/debugify-gm');
String.prototype.ucFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

$(document).one('DOMContentLoaded', () => {
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

    require('./inc/register-menu');

    require('./inc/toast')(`${GM_info.script.name} v${GM_info.script.version} loaded.`);
});