(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
// @require      https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/1643a4cf77c8c90a27930f8b868c237720d4053c/inc/run-before-main.js

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

$(document).one('DOMContentLoaded', function () {
    ['remodal_css1', 'remodal_css2', 'toast_css'].map(GM_getResourceText).map(function (c) {
        return $('<style>' + c + '</style>')[0];
    }).forEach(function (c) {
        return document.body.appendChild(c);
    });

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

    require('./inc/toast')(GM_info.script.name + ' v' + GM_info.script.version + ' loaded.');
});

},{"./inc/debugify-gm":2,"./inc/observers/action-point":7,"./inc/observers/action-timer":8,"./inc/observers/captcha":9,"./inc/observers/hp":10,"./inc/observers/skill-levels":12,"./inc/register-menu":13,"./inc/subscriptions/action-points":15,"./inc/subscriptions/actions-finished":16,"./inc/subscriptions/captcha":17,"./inc/subscriptions/full-health":18,"./inc/toast":19}],2:[function(require,module,exports){
'use strict';

var orig = {
    setvalue: GM_setValue,
    getvalue: GM_getValue
};

GM_setValue = function GM_setValue(key, value) {
    console.debug({ operation: 'set-value', key: key, value: value });
    orig.setvalue.call(null, key, value);
};

GM_getValue = function GM_getValue(key, defaultReturn) {
    defaultReturn = defaultReturn || null;
    var returnValue = orig.getvalue.call(null, key, defaultReturn);
    console.debug({ operation: 'get-value', key: key, defaultReturn: defaultReturn, returnValue: returnValue });
    return returnValue;
};

},{}],3:[function(require,module,exports){
"use strict";

var $parent = $("#Profile_Tabs").find(".SkillHolder");

var map = function map() {
    var self = $(this);

    return {
        name: self.find(">.name>span").text().trim().toLowerCase(),
        level: parseInt(self.find(">.level>.Level").text().trim())
    };
};

var reduce = function reduce(acc, curr) {
    acc[curr.name] = curr.level;
    return acc;
};

var findDivs = function findDivs() {
    return $parent.find(">div");
};

console.time("Waiting for levels DOM");
var ready = new Promise(function (resolve) {
    var interval = setInterval(function () {
        if (findDivs().length >= 12) {
            console.timeEnd("Waiting for levels DOM");
            clearInterval(interval);
            resolve();
        }
    }, 25);
});

var then = function then() {
    return $.makeArray($parent.find(">div").map(map)).reduce(reduce, {});
};

module.exports = function () {
    return ready.then(then);
};

module.exports.ready = ready;

},{}],4:[function(require,module,exports){
"use strict";

var integer = function integer(key, def) {
    // getvalue may return key which is an empty string
    // check for def, see if it's set
    // if all else fails, return 0
    var r = ko.observable(parseInt(GM_getValue(key, def) || def || 0));
    r.subscribe(function (v) {
        return GM_setValue(key, parseInt(v));
    });
    return r;
};
var boolean = function boolean(key, def) {
    var r = ko.observable(1 == GM_getValue(key, def));
    r.subscribe(function (v) {
        return GM_setValue(key, v ? 1 : 0);
    });
    return r;
};

module.exports = { integer: integer, boolean: boolean };

},{}],5:[function(require,module,exports){
'use strict';

var gmo = require('./gm-observable');
var toast = require('./toast');

var observables = {
    apPCT: ko.observable(0),
    timer: ko.observable(0),
    hpPCT: ko.observable(0),
    captcha: ko.observable(false),
    notify_AP: gmo.boolean('notify_ap', true),
    notify_HP: gmo.boolean('notify_hp', true),
    notify_captcha: gmo.boolean('notify_captcha', true),
    notify_timer: gmo.boolean('notify_timer', true)
};

module.exports = {
    add: function add(name, value) {
        observables[name] = value;

        return module.exports;
    },
    get model() {
        return observables;
    },
    ready: {
        skillLevels: require('./get-levels')().then(function (levels) {
            var mx = module.exports;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var skill = _step.value;

                    var lvl = ko.observable(levels[skill]),
                        notifyAt = gmo.integer('notify_at_lvl_' + skill, 0);

                    mx['lvl_' + skill] = lvl;
                    mx['notify_at_lvl_' + skill] = notifyAt;
                    mx['lvl_should_notify_' + skill] = ko.pureComputed(function () {
                        return notifyAt() > 0 && lvl() >= notifyAt();
                    });
                    mx['lvl_should_notify_' + skill + '_text'] = ko.pureComputed(function () {
                        if (notifyAt() < 1) {
                            return 'Disabled';
                        } else if (notifyAt() <= lvl()) {
                            return 'Reached';
                        } else {
                            return notifyAt() - lvl() + ' to go!';
                        }
                    });
                    mx['lvl_should_notify_' + skill + '_class'] = ko.pureComputed(function () {
                        if (notifyAt() < 1) {
                            return 'active text-muted';
                        } else if (notifyAt() <= lvl()) {
                            return 'success text-success';
                        } else {
                            return 'info text-primary';
                        }
                    });
                };

                for (var _iterator = Object.keys(levels)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
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

            return levels;
        })
    }
};

GM_registerMenuCommand('Debug ' + GM_info.script.name, function () {
    var ob = {},
        gm = {};

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.keys(observables)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var k = _step2.value;

            ob[k] = observables[k]();
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

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = GM_listValues()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _k = _step3.value;

            gm[_k] = GM_getValue(_k);
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

    console.debug({
        observables: ob,
        storage: gm
    });
    toast('See the console');
});

},{"./get-levels":3,"./gm-observable":4,"./toast":19}],6:[function(require,module,exports){
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

},{"./sfx":14}],7:[function(require,module,exports){
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

},{"../model":5,"../x-out-of-y":20,"./settings.json":11}],8:[function(require,module,exports){
'use strict';

var node = document.querySelector(".timer_plaque");
var model = require('../model').model.timer;

new MutationObserver(function () {
    var text = node.textContent.trim();
    model(isNaN(text) ? text : parseFloat(text));
}).observe(node, require('./settings.json'));

},{"../model":5,"./settings.json":11}],9:[function(require,module,exports){
"use strict";

var $node = $(".PopupCaptcha");
var model = require('../model').model.captcha;

new MutationObserver(function () {
    model($node.is(":visible"));
}).observe($node[0], require('./settings.json'));

},{"../model":5,"./settings.json":11}],10:[function(require,module,exports){
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

},{"../model":5,"../x-out-of-y":20,"./settings.json":11}],11:[function(require,module,exports){
module.exports={
  "childList": true,
  "characterData": true,
  "attributes": true,
  "subtree": true
}
},{}],12:[function(require,module,exports){
"use strict";

var model = require('../model');

model.ready.skillLevels.then(function () {
    var $tl = $("#mainContainer").find(".timer_line");
    var m = model.model;
    var $level = $tl.find(".Level")[0];
    var $skill = $tl.find(".Skill")[0];
    var settings = require('./settings.json');

    var mo = new MutationObserver(function () {
        m["lvl_" + $skill.textContent.trim().toLowerCase()](parseInt($level.textContent.trim()));
    });

    mo.observe($level, settings);
    console.debug('Skill level observer initialised');
});

},{"../model":5,"./settings.json":11}],13:[function(require,module,exports){
'use strict';

var model = require('./model');

var createNotificationClick = function createNotificationClick() {
    var key = $(this).attr("data-key");
    model.model[key](!model.model[key]());
};

var createNotificationBtn = function createNotificationBtn(key, label) {
    return $('<button/>').attr({
        type: 'button',
        'class': 'btn',
        'data-bind': 'css: {\'btn-danger\': !' + key + '(), \'btn-success\': ' + key + '}',
        'data-key': key
    }).click(createNotificationClick).append($('<span>' + label + ': </span>'), $('<span data-bind="text: ' + key + '() ? \'Enabled\' : \'Disabled\'"/>'));
};

var $modalWrapper = $('<div data-remodal-id="' + GM_info.script.name + '"><button data-remodal-action="close" class="remodal-close"></button></div>');

var modalInnerContainer = document.createElement('div');
$modalWrapper.append(modalInnerContainer);

var shadow = modalInnerContainer.createShadowRoot();
var root = $('<div class="container-fluid text-left"/>')[0];

['bs_css1', 'bs_css2'].map(GM_getResourceText).map(function (c) {
    return '<style>' + c + '</style>';
}).forEach(function (c) {
    return shadow.appendChild($(c)[0]);
});

shadow.appendChild($('<style>.vertical-middle td{vertical-align:middle!important}</style>')[0]);
shadow.appendChild(root);

var $skillLevelContainer = $('<tbody/>');

model.ready.skillLevels.then(function (levels) {
    var i = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(levels).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            $skillLevelContainer.append($('<tr data-bind="css:lvl_should_notify_' + name + '_class"/>').append('<td><label for="notify_at_lvl_' + i + '">' + name.ucFirst() + '</label></td>', $('<td/>').append($('<input/>').attr({
                type: 'number',
                id: 'notify_at_lvl_' + i,
                min: 0,
                style: 'width:85px',
                'class': 'form-control input-sm',
                'data-bind': 'textInput: notify_at_lvl_' + name
            })), $('<td><span data-bind="text: lvl_should_notify_' + name + '_text"/></td>')));
            ++i;
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

    ko.applyBindings(model.model, $skillLevelContainer[0]);
});

$(root).append('<h1 class="text-center">' + GM_info.script.name + ' v' + GM_info.script.version + '</h1>', '<h3>Notification toggles</h3>', $('<div class="btn-group btn-group-xs">').append(createNotificationBtn('notify_captcha', 'Captcha'), createNotificationBtn('notify_AP', 'Full AP'), createNotificationBtn('notify_HP', 'Full HP'), createNotificationBtn('notify_timer', 'Idle')), '<hr/>', $('<h3 title="Notifies you when you reach a given skill level. Set to 0 to disable">Level notifications</h3>'), $('<table class="table table-condensed vertical-middle" style="width:auto"/>').append($skillLevelContainer));

var $modal = $modalWrapper.remodal({ hashTracking: false });

$("#Left_menu").find(">.LeftMenu.LeftMenuLinks.side_block").prepend('<div class="smallchain"/>', $('<div class="toggle" style="text-align:center"><a href="javascript:void(0)">' + GM_info.script.name + ' options</a></div>').click(function () {
    $modal.open();
}));

ko.applyBindings(model.model, root);

},{"./model":5}],14:[function(require,module,exports){
"use strict";

var notification = new buzz.sound("https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/3cad641d61497ba25be33ae9db0ef30742628452/assets/notification.mp3", {
    preload: true,
    autoplay: false,
    loop: false
});

module.exports = { notification: notification };

},{}],15:[function(require,module,exports){
'use strict';

var auraBtn = document.querySelector('#Left_menu a[href="javascript:PopupHandler.Popup(\'Cast\');"] div[data-selector]') || document.createElement("span");
var options = {
    onclick: function onclick() {
        auraBtn.click();
    }
};
var notify = require('../notify');
var model = require('../model').model;

model.apPCT.subscribe(function (v) {
    if (v >= 100.0 && model.notify_AP()) {
        notify('AP full!', options);
    }
});

},{"../model":5,"../notify":6}],16:[function(require,module,exports){
'use strict';

var stopped = 'Stopped';
var notify = require('../notify');
var model = require('../model').model;

model.timer.subscribe(function (v) {
    if (stopped == v && model.notify_timer()) {
        notify('Actions finished: ' + v);
    }
});

},{"../model":5,"../notify":6}],17:[function(require,module,exports){
'use strict';

var notify = require('../notify');
var options = { timeout: 3600000 };
var model = require('../model').model;

model.captcha.subscribe(function (visible) {
    if (visible && model.notify_captcha()) {
        notify('Captcha!', options);
    }
});

},{"../model":5,"../notify":6}],18:[function(require,module,exports){
'use strict';

var notify = require('../notify');
var model = require('../model').model;

model.hpPCT.subscribe(function (v) {
    if (v >= 100.0 && model.notify_HP()) {
        notify('HP full!');
    }
});

},{"../model":5,"../notify":6}],19:[function(require,module,exports){
'use strict';

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

},{}],20:[function(require,module,exports){
"use strict";

module.exports = /([0-9\.]+)\s*\/\s*([0-9\.]+)/;

},{}]},{},[1]);
