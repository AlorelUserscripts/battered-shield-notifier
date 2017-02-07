// ==UserScript==
// @name         Battered shield helper
// @namespace    https://github.com/AlorelUserscripts/battered-shield-notifier
// @version      0.1.2
// @description  Helps with your battered shields
// @author       Alorel
// @include      /^https?:\/\/(?=www\.)?batteredshield\.com\/game\/?/
// @require      https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/buzz/1.2.0/buzz.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @icon64       https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/93f9519972e5cb25734c29fa241a90a150e55dbf/icon-64.png
// @icon         https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/93f9519972e5cb25734c29fa241a90a150e55dbf/icon-32.png
// @grant        GM_notification
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/master/battered-shield-helper.user.js
// @updateURL    https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/master/battered-shield-helper.meta.js
// @homepage     https://github.com/AlorelUserscripts/battered-shield-notifier
// @supportURL   https://github.com/AlorelUserscripts/battered-shield-notifier/issues
// ==/UserScript==

(function () {
    var sfx = new buzz.sound("https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/a670d7c3fcf8d19a64bc8f1d151b0939ab72448a/notification.mp3", {
        preload: true,
        autoplay: false,
        loop: false
    });

    function notify(msg, preventSound) {
        console.debug('Notifying: ' + msg);

        GM_notification({
            text: msg,
            timeout: 15000
        });

        if (!(preventSound || false)) {
            sfx.play();
        }
    }

    var mutationObserverSettings = {childList: true, characterData: true, attributes: true, subtree: true};
    var regex = {
        xOutOfY: /([0-9\.]+)\s*\/\s*([0-9\.]+)/
    };

    function readyFn() {
        document.removeEventListener('DOMContentLoaded', readyFn);

        //Define model
        var model = {
            apPCT: ko.observable(0),
            timer: ko.observable(0),
            hpPCT: ko.observable(0)
        };

        // Observe timer
        (function () {
            var node = document.querySelector(".timer_plaque");
            new MutationObserver(function () {
                var text = node.textContent.trim();
                model.timer(isNaN(text) ? text : parseFloat(text));
            }).observe(node, mutationObserverSettings);
        })();

        //Observe AP
        (function () {
            var node = document.querySelector(".attrib_value.ap_data");
            new MutationObserver(function () {
                var match = node.textContent.trim().match(regex.xOutOfY);

                if (match) {
                    model.apPCT(parseFloat(match[1]) / parseFloat(match[2]) * 100);
                }
            }).observe(node, mutationObserverSettings);
        })();

        //Observe HP
        (function () {
            var node = document.querySelector('.attrib_name[title="Hit Points"]').nextElementSibling;
            new MutationObserver(function () {
                var match = node.textContent.trim().match(regex.xOutOfY);

                if (match) {
                    model.hpPCT(parseFloat(match[1]) / parseFloat(match[2]) * 100);
                }
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

        model.apPCT.subscribe(function (newVal) {
            console.debug('AP: ' + newVal.toFixed(3));
            if (newVal >= 100) {
                notify('AP full!');
            }
        });

        model.hpPCT.subscribe(function (newVal) {
            console.debug('HP: ' + newVal.toFixed(3));
            if (newVal >= 100) {
                notify('HP full!');
            }
        })
    }

    document.addEventListener('DOMContentLoaded', readyFn);
})();