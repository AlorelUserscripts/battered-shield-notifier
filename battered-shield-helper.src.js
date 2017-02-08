// ==UserScript==
// @name         Battered shield helper
// @namespace    https://github.com/AlorelUserscripts/battered-shield-notifier
// @version      0.2.1
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
// @grant        unsafeWindow
//
// @require      https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js
// @require      https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/0242848a5d5c34368d81582051dd051b6a11ee70/lib/buzz.min.js
// @require      https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/0242848a5d5c34368d81582051dd051b6a11ee70/lib/knockout.min.js
// @require      https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/44d6524c94a9fd58a1c8c63909debbbcbe00ba8d/lib/jquery.toast.min.js
//
// @resource toast_css https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/44d6524c94a9fd58a1c8c63909debbbcbe00ba8d/lib/jquery.toast.min.css
// ==/UserScript==

$(document).one('DOMContentLoaded', () => {
    require('./inc/observers/action-point');
    require('./inc/observers/action-timer');
    require('./inc/observers/captcha');
    require('./inc/observers/hp');

    require('./inc/subscriptions/action-points');
    require('./inc/subscriptions/actions-finished');
    require('./inc/subscriptions/captcha');
    require('./inc/subscriptions/full-health');

    require('./inc/toast')(`${GM_info.script.name} v${GM_info.script.version} loaded.`);
});