// ==UserScript==
// @name         Battered shield helper
// @namespace    https://github.com/AlorelUserscripts/battered-shield-notifier
// @version      0.2.1
// @description  Helps with your battered shields
// @author       Alorel
// @include      /^https?:\/\/(?=www\.)?batteredshield\.com\/game\/?/
// @require      https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/buzz/1.2.0/buzz.min.js
// @icon64       https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/93f9519972e5cb25734c29fa241a90a150e55dbf/icon-64.png
// @icon         https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/93f9519972e5cb25734c29fa241a90a150e55dbf/icon-32.png
// @grant        GM_notification
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/master/battered-shield-helper.user.js
// @updateURL    https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/master/battered-shield-helper.meta.js
// @homepage     https://github.com/AlorelUserscripts/battered-shield-notifier
// @supportURL   https://github.com/AlorelUserscripts/battered-shield-notifier/issues
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
    const sfx = new buzz.sound("https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/a670d7c3fcf8d19a64bc8f1d151b0939ab72448a/notification.mp3", {
        preload: true,
        autoplay: false,
        loop: false
    });

    const notify = function (msg, options) {
        console.debug('Notifying: ' + msg);
        options = Object.assign(
            {text: msg, timeout: 15000, sound: true},
            options || {}
        );

        GM_notification(options);

        if (options.sound) {
            sfx.play();
        }
    };

    const mutationObserverSettings = {childList: true, characterData: true, attributes: true, subtree: true};
    const regex = {
        xOutOfY: /([0-9\.]+)\s*\/\s*([0-9\.]+)/
    };

    //Define model
    const model = {
        apPCT: ko.observable(0),
        timer: ko.observable(0),
        hpPCT: ko.observable(0),
        captcha: ko.observable(false)
    };

    // Observe timer
    (function () {
        const node = document.querySelector(".timer_plaque");
        new MutationObserver(function () {
            const text = node.textContent.trim();
            model.timer(isNaN(text) ? text : parseFloat(text));
        }).observe(node, mutationObserverSettings);
    })();

    //Observe AP
    (function () {
        const node = document.querySelector(".attrib_value.ap_data");
        new MutationObserver(function () {
            const match = node.textContent.trim().match(regex.xOutOfY);

            if (match) {
                model.apPCT(parseFloat(match[1]) / parseFloat(match[2]) * 100);
            }
        }).observe(node, mutationObserverSettings);
    })();

    //Observe HP
    (function () {
        const node = document.querySelector('.attrib_name[title="Hit Points"]').nextElementSibling;
        new MutationObserver(function () {
            const match = node.textContent.trim().match(regex.xOutOfY);

            if (match) {
                model.hpPCT(parseFloat(match[1]) / parseFloat(match[2]) * 100);
            }
        }).observe(node, mutationObserverSettings);
    })();

    //Observe captcha
    (function () {
        const node = document.querySelector(".PopupCaptcha");
        new MutationObserver(function () {
            model.captcha(getComputedStyle(node).visibility === "visible");
        }).observe(node, mutationObserverSettings);
    })();

    // Subscribe
    model.timer.subscribe(function (newVal) {
        console.debug('Timer: ' + newVal);
        // clearTimeout(timerTimeout);
        if (newVal === 'Stopped') {
            notify('Actions finished: ' + newVal);
        }
    });

    (function () {
        const options = {
            onclick: function () {
                (document.querySelector(`#Left_menu a[href="javascript:PopupHandler.Popup('Cast');"] div[data-selector]`) || document.createElement('div')).click();
            }
        };
        model.apPCT.subscribe(function (newVal) {
            console.debug('AP: ' + newVal.toFixed(3));
            if (newVal >= 100) {
                notify('AP full!', options);
            }
        });
    })();

    model.hpPCT.subscribe(function (newVal) {
        console.debug('HP: ' + newVal.toFixed(3));
        if (newVal >= 100) {
            notify('HP full!');
        }
    });

    model.captcha.subscribe(function (visible) {
        if (visible) {
            notify('Captcha!', {timeout: Number.MAX_VALUE});
        }
    });
}, {once: true, passive: true});