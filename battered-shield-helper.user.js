(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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

$(document).one('DOMContentLoaded', function () {
    require('./inc/observers/action-point');
    require('./inc/observers/action-timer');
    require('./inc/observers/captcha');
    require('./inc/observers/hp');

    require('./inc/subscriptions/action-points');
    require('./inc/subscriptions/actions-finished');
    require('./inc/subscriptions/captcha');
    require('./inc/subscriptions/full-health');

    require('./inc/toast')(GM_info.script.name + ' v' + GM_info.script.version + ' loaded.');
});

},{"./inc/observers/action-point":4,"./inc/observers/action-timer":5,"./inc/observers/captcha":6,"./inc/observers/hp":7,"./inc/subscriptions/action-points":10,"./inc/subscriptions/actions-finished":11,"./inc/subscriptions/captcha":12,"./inc/subscriptions/full-health":13,"./inc/toast":14}],2:[function(require,module,exports){
"use strict";

var debug = function debug(v) {
    console.debug({
        name: this.toString(),
        value: v
    });
};

var observables = {
    apPCT: ko.observable(0),
    timer: ko.observable(0),
    hpPCT: ko.observable(0),
    captcha: ko.observable(false)
};

var addListeners = [];

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = Object.keys(observables)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var k = _step.value;

        observables[k].subscribe(debug, k);
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

module.exports = {
    add: function add(name, value) {
        observables[name] = value;
        value.subscribe(debug, name);

        if (addListeners.length) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = addListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var listener = _step2.value;

                    listener(name, value);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        return module.exports;
    },
    get model() {
        return observables;
    },
    addListener: function addListener(listener) {
        if (typeof listener === "function") {
            addListeners.push(listener);
        } else {
            throw new TypeError("Listener must be a function");
        }
    }
};

unsafeWindow.batteredShieldHelper = {
    get debug() {
        var out = {};

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = Object.keys(observables)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var k = _step3.value;

                out[k] = observables[k]();
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return out;
    }
};

},{}],3:[function(require,module,exports){
'use strict';

var sfx = require('./sfx').notification;

module.exports = function (msg, options) {
    console.debug('Notifying: ' + msg);
    options = $.extend({ text: msg, timeout: 15000, sound: true }, options || {});

    GM_notification(options);

    if (options.sound) {
        sfx.play();
    }
};

},{"./sfx":9}],4:[function(require,module,exports){
'use strict';

var node = document.querySelector(".attrib_value.ap_data");
var model = require('../model').model.apPCT;
var regex = require('../x-out-of-y');

new MutationObserver(function () {
    var match = node.textContent.trim().match(regex);

    if (match) {
        model(parseFloat(match[1]) / parseFloat(match[2]) * 100);
    }
}).observe(node, require('./settings.json'));

},{"../model":2,"../x-out-of-y":15,"./settings.json":8}],5:[function(require,module,exports){
'use strict';

var node = document.querySelector(".timer_plaque");
var model = require('../model').model.timer;

new MutationObserver(function () {
    var text = node.textContent.trim();
    model(isNaN(text) ? text : parseFloat(text));
}).observe(node, require('./settings.json'));

},{"../model":2,"./settings.json":8}],6:[function(require,module,exports){
"use strict";

var $node = $(".PopupCaptcha");
var model = require('../model').model.captcha;

new MutationObserver(function () {
    model($node.is(":visible"));
}).observe($node[0], require('./settings.json'));

},{"../model":2,"./settings.json":8}],7:[function(require,module,exports){
'use strict';

var node = document.querySelector('.attrib_name[title="Hit Points"]').nextElementSibling;
var model = require('../model').model.hpPCT;
var regex = require('../x-out-of-y');

new MutationObserver(function () {
    var match = node.textContent.trim().match(regex);

    if (match) {
        model(parseFloat(match[1]) / parseFloat(match[2]) * 100);
    }
}).observe(node, require('./settings.json'));

},{"../model":2,"../x-out-of-y":15,"./settings.json":8}],8:[function(require,module,exports){
module.exports={
  "childList": true,
  "characterData": true,
  "attributes": true,
  "subtree": true
}
},{}],9:[function(require,module,exports){
"use strict";

var notification = new buzz.sound("https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/3cad641d61497ba25be33ae9db0ef30742628452/assets/notification.mp3", {
    preload: true,
    autoplay: false,
    loop: false
});

module.exports = { notification: notification };

},{}],10:[function(require,module,exports){
'use strict';

var auraBtn = document.querySelector('#Left_menu a[href="javascript:PopupHandler.Popup(\'Cast\');"] div[data-selector]') || document.createElement("span");
var options = {
    onclick: function onclick() {
        auraBtn.click();
    }
};
var notify = require('../notify');

require('../model').model.apPCT.subscribe(function (v) {
    if (v >= 100.0) {
        notify('AP full!', options);
    }
});

},{"../model":2,"../notify":3}],11:[function(require,module,exports){
'use strict';

var stopped = 'Stopped';
var notify = require('../notify');

require('../model').model.timer.subscribe(function (v) {
    if (stopped === v) {
        notify('Actions finished: ' + v);
    }
});

},{"../model":2,"../notify":3}],12:[function(require,module,exports){
'use strict';

var notify = require('../notify');
var options = { timeout: 3600000 };

require('../model').model.captcha.subscribe(function (visible) {
    if (visible) {
        notify('Captcha!', options);
    }
});

},{"../model":2,"../notify":3}],13:[function(require,module,exports){
'use strict';

var notify = require('../notify');

require('../model').model.hpPCT.subscribe(function (v) {
    if (v >= 100.0) {
        notify('HP full!');
    }
});

},{"../model":2,"../notify":3}],14:[function(require,module,exports){
'use strict';

var css = document.createElement('style');
css.textContent = GM_getResourceText('toast_css');

document.body.appendChild(css);

var baseCfg = {
    showHideTransition: 'fade', // fade, slide or plain
    allowToastClose: true, // Boolean value true or false
    hideAfter: 5000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
    stack: 100, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
    bgColor: '#444444', // Background color of the toast
    textColor: '#eeeeee', // Text color of the toast
    textAlign: 'left', // Text alignment i.e. left, right or center
    loader: false, // Whether to show loader or not. True by default
    loaderBg: '#9EC600' };

module.exports = function (msg, cfg) {
    console.debug('Toasting: ' + msg);
    $.toast($.extend({ text: msg }, baseCfg, cfg || {}));
};

},{}],15:[function(require,module,exports){
"use strict";

module.exports = /([0-9\.]+)\s*\/\s*([0-9\.]+)/;

},{}]},{},[1]);
