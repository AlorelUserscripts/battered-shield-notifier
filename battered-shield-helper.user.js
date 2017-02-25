// ==UserScript==
// @name         Battered shield helper
// @namespace    https://github.com/AlorelUserscripts/battered-shield-notifier
// @version      0.6.3
// @description  Helps with your battered shields
// @author       Alorel
// @include      /^https?:\/\/(?=www\.)?batteredshield\.com\/game\/?/
// @homepage     https://github.com/AlorelUserscripts/battered-shield-notifier
// @supportURL   https://github.com/AlorelUserscripts/battered-shield-notifier/issues
//
// @downloadURL  https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/master/battered-shield-helper.user.js
// @updateURL    https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/master/battered-shield-helper.meta.js
//
// @icon64       https://media.githubusercontent.com/media/AlorelUserscripts/battered-shield-notifier/ca49e2e9ea77b4b067bb91faf78f0f7c6086aa8e/assets/icon-64.png
// @icon         https://media.githubusercontent.com/media/AlorelUserscripts/battered-shield-notifier/ca49e2e9ea77b4b067bb91faf78f0f7c6086aa8e/assets/icon-32.png
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
// @require      https://cdn.jsdelivr.net/knockout/3.4.1/knockout.js
// @require      https://cdn.jsdelivr.net/buzz/1.1.0/buzz.min.js
// @require      https://cdn.jsdelivr.net/bluebird/3.4.7/bluebird.min.js
// @require      https://cdn.jsdelivr.net/remodal/1.1.1/remodal.min.js
// @require      https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/44d6524c94a9fd58a1c8c63909debbbcbe00ba8d/lib/jquery.toast.min.js

// @resource toast_css https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/44d6524c94a9fd58a1c8c63909debbbcbe00ba8d/lib/jquery.toast.min.css
// @resource remodal_css1 https://cdn.jsdelivr.net/remodal/1.1.1/remodal-default-theme.css
// @resource remodal_css2 https://cdn.jsdelivr.net/remodal/1.1.1/remodal.css
// @resource bs_css1 https://cdn.jsdelivr.net/bootstrap/3.3.7/css/bootstrap.min.css
// @resource bs_css2 https://cdn.jsdelivr.net/bootstrap/3.3.7/css/bootstrap-theme.min.css
// ==/UserScript==
!function(t,e,n,i,r,o,s,a,l,c,u,d){c.options.deferUpdates=!0,function t(e,n,i){function r(s,a){if(!n[s]){if(!e[s]){var l="function"==typeof require&&require;if(!a&&l)return l(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var u=n[s]={exports:{}};e[s][0].call(u.exports,function(t){var n=e[s][1][t];return r(n?n:t)},u,u.exports,t,e,n,i)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<i.length;s++)r(i[s]);return r}({1:[function(t,s,a){"use strict";u.prototype.ucFirst=function(){return this.charAt(0).toUpperCase()+this.slice(1)};var l=t("./inc/open-changelog");d.addEventListener("DOMContentLoaded",function(){["remodal_css1","remodal_css2","toast_css"].map(n).map(function(t){return $("<style>"+t+"</style>")[0]}).forEach(function(t){return d.body.appendChild(t)}),$("<style>.remodal-overlay,.remodal-wrapper{z-index:100000}</style>").appendTo(d.body),t("./inc/observers/action-point"),t("./inc/observers/action-timer"),t("./inc/observers/captcha"),t("./inc/observers/hp"),t("./inc/observers/skill-levels"),t("./inc/subscriptions/action-points"),t("./inc/subscriptions/actions-finished"),t("./inc/subscriptions/captcha"),t("./inc/subscriptions/full-health"),t("./inc/subscriptions/skill-levels"),t("./inc/register-menu"),t("./inc/version-compare")(e.script.version,r("last_version_used","0"))>0&&t("./inc/notify")(e.script.name+" has been updated! Click here for the changelog",{onclick:l}),o("last_version_used",e.script.version)},{once:!0,passive:!0}),i(e.script.name+" changelog",l)},{"./inc/notify":5,"./inc/observers/action-point":6,"./inc/observers/action-timer":7,"./inc/observers/captcha":8,"./inc/observers/hp":9,"./inc/observers/skill-levels":11,"./inc/open-changelog":12,"./inc/register-menu":13,"./inc/subscriptions/action-points":15,"./inc/subscriptions/actions-finished":16,"./inc/subscriptions/captcha":17,"./inc/subscriptions/full-health":18,"./inc/subscriptions/skill-levels":19,"./inc/version-compare":21}],2:[function(t,e,n){"use strict";var i=$("#Profile_Tabs").find(".SkillHolder"),r=function(){var t=$(this);return{name:t.find(">.name>span").text().trim().toLowerCase(),level:parseInt(t.find(">.level>.Level").text().trim())}},o=function(t,e){return t[e.name]=e.level,t},s=function(){return i.find(">div")};console.time("Waiting for levels DOM");var a=new l(function(t){var e=setInterval(function(){s().length>=12&&(console.timeEnd("Waiting for levels DOM"),clearInterval(e),t())},25)}),c=function(){return $.makeArray(i.find(">div").map(r)).reduce(o,{})};e.exports=function(){return a.then(c)},e.exports.ready=a},{}],3:[function(t,e,n){"use strict";var i=function(t,e){var n=c.observable(parseInt(r(t,e)||e||0));return n.subscribe(function(e){return o(t,parseInt(e))}),n},s=function(t,e){var n=c.observable(1==r(t,e));return n.subscribe(function(e){return o(t,e?1:0)}),n};e.exports={integer:i,boolean:s}},{}],4:[function(t,n,o){"use strict";var a=t("./gm-observable"),l=t("./uuid"),u=t("./notify"),f={notify_HP:a.boolean("notify_hp",!0)},p={hide:!1,subscribe:!0},v=function(t){var e=new CustomEvent("battered-shield-helper."+this,{detail:t});d.dispatchEvent(e)},b=function(t,e,i){return i=$.extend({},p,i||{}),Object.defineProperty(f,t,{configurable:!1,writable:!1,enumerable:!i.hide,value:e}),i.subscribe&&e.subscribe(v,t),n.exports};b("apPCT",c.observable(0)),b("timer",c.observable(0)),b("hpPCT",c.observable(0)),b("captcha",c.observable(!1)),b("notify_captcha",a.boolean("notify_captcha",!0)),b("notify_timer",a.boolean("notify_timer",!0)),b("notify_AP_pct",a.integer("notify_ap_pct",100)),b("notify_HP_pct",a.integer("notify_hp_pct",75)),n.exports=Object.defineProperties({add:b,addInternal:function(t,e){for(;;)try{var n="_"+l();return b(n,t,$.extend({subscribe:!1,hide:!0},e||{})),n}catch(t){}},ready:{skillLevels:t("./get-levels")().then(function(t){var e=!0,n=!1,i=void 0;try{for(var r,o=function(){var e=r.value,n=c.observable(t[e]),i=a.integer("notify_at_lvl_"+e,0);b("lvl_"+e,n),b("notify_at_lvl_"+e,i),b("lvl_should_notify_"+e,c.pureComputed(function(){return i()>0&&n()>=i()}))},s=Object.keys(t)[Symbol.iterator]();!(e=(r=s.next()).done);e=!0)o()}catch(t){n=!0,i=t}finally{try{!e&&s.return&&s.return()}finally{if(n)throw i}}return t})}},{model:{get:function(){return f},configurable:!0,enumerable:!0}}),i("Debug "+e.script.name,function(){var t={},e={},n=!0,i=!1,o=void 0;try{for(var a,l=Object.keys(f)[Symbol.iterator]();!(n=(a=l.next()).done);n=!0){var c=a.value;t[c]=f[c]()}}catch(t){i=!0,o=t}finally{try{!n&&l.return&&l.return()}finally{if(i)throw o}}var d=!0,p=!1,v=void 0;try{for(var b,m=s()[Symbol.iterator]();!(d=(b=m.next()).done);d=!0){var y=b.value;e[y]=r(y)}}catch(t){p=!0,v=t}finally{try{!d&&m.return&&m.return()}finally{if(p)throw v}}console.debug({observables:t,storage:e}),u("See the console",{timeout:5e3})})},{"./get-levels":2,"./gm-observable":3,"./notify":5,"./uuid":20}],5:[function(e,n,i){"use strict";var r=e("./sfx").notification,o={timeout:36e5,sound:!0,highlight:!0};n.exports=function(e,n){console.debug("Notifying: "+e),n=$.extend({text:e},o,n||{}),t(n),n.sound&&r.play()}},{"./sfx":14}],6:[function(t,e,n){"use strict";var i=d.querySelector(".attrib_value.ap_data"),r=t("../model").model.apPCT,o=t("../x-out-of-y");new MutationObserver(function(){var t=i.textContent.trim().match(o);t&&r(parseFloat(t[1])/parseFloat(t[2])*100)}).observe(i,t("./settings.json"))},{"../model":4,"../x-out-of-y":22,"./settings.json":10}],7:[function(t,e,n){"use strict";var i=d.querySelector(".timer_plaque"),r=t("../model").model.timer;new MutationObserver(function(){var t=i.textContent.trim();r(isNaN(t)?t:parseFloat(t))}).observe(i,t("./settings.json"))},{"../model":4,"./settings.json":10}],8:[function(t,e,n){"use strict";var i=$(".PopupCaptcha"),r=t("../model").model.captcha;new MutationObserver(function(){r(i.is(":visible"))}).observe(i[0],t("./settings.json"))},{"../model":4,"./settings.json":10}],9:[function(t,e,n){"use strict";var i=d.querySelector('.attrib_name[title="Hit Points"]').nextElementSibling,r=t("../model").model.hpPCT,o=t("../x-out-of-y");new MutationObserver(function(){var t=i.textContent.trim().match(o);t&&r(parseFloat(t[1])/parseFloat(t[2])*100)}).observe(i,t("./settings.json"))},{"../model":4,"../x-out-of-y":22,"./settings.json":10}],10:[function(t,e,n){e.exports={childList:!0,characterData:!0,attributes:!0,subtree:!0}},{}],11:[function(t,e,n){"use strict";var i=t("../model");i.ready.skillLevels.then(function(){var e=$("#mainContainer").find(".timer_line"),n=i.model,r=e.find(".Level")[0],o=e.find(".Skill")[0],s=t("./settings.json"),a=new MutationObserver(function(){if(r&&o){var t=r.textContent,e=o.textContent;t&&e&&n["lvl_"+e.trim().toLowerCase()](parseInt(t.trim()))}});a.observe(r.parentNode,s),console.debug("Skill level observer initialised")})},{"../model":4,"./settings.json":10}],12:[function(t,n,i){"use strict";n.exports=function(){window.open("https://github.com/AlorelUserscripts/battered-shield-notifier/blob/master/CHANGELOG.md#"+e.script.version.replace(/\./g,""))}},{}],13:[function(t,i,r){"use strict";var o=t("./model"),s=t("./uuid"),a=function(){var t=$(this).attr("data-key");o.model[t](!o.model[t]())},l=function(t,e){return $("<button/>").attr({type:"button",class:"btn","data-bind":"css: {'btn-danger': !"+t+"(), 'btn-success': "+t+"}","data-key":t}).click(a).append($("<span>"+e+": </span>"),$('<span data-bind="text: '+t+"() ? 'Enabled' : 'Disabled'\"/>"))},u=$('<div data-remodal-id="'+e.script.name+'"><button data-remodal-action="close" class="remodal-close"></button></div>'),f=d.createElement("div");u.append(f);var p=f.createShadowRoot(),v=$('<div class="container-fluid text-left"/>')[0];["bs_css1","bs_css2"].map(n).map(function(t){return"<style>"+t+"</style>"}).forEach(function(t){return p.appendChild($(t)[0])}),p.appendChild($("<style>.vertical-middle td{vertical-align:middle!important}</style>")[0]),p.appendChild(v);var b=$("<tbody/>");o.ready.skillLevels.then(function(t){var e=!0,n=!1,i=void 0;try{for(var r,a=function(){var t=r.value,e=s(),n=o.addInternal(c.pureComputed(function(){return o.model["notify_at_lvl_"+t]()<1?"Disabled":o.model["notify_at_lvl_"+t]()<=o.model["lvl_"+t]()?"Reached":o.model["notify_at_lvl_"+t]()-o.model["lvl_"+t]()+" to go!"})),i=o.addInternal(c.pureComputed(function(){return o.model["notify_at_lvl_"+t]()<1?"active text-muted":o.model["notify_at_lvl_"+t]()<=o.model["lvl_"+t]()?"success text-success":"info text-primary"}));b.append($('<tr data-bind="css:'+i+'"/>').append('<td><label for="'+e+'">'+t.ucFirst()+"</label></td>",$("<td/>").append($("<input/>").attr({type:"number",id:e,min:0,style:"width:85px",class:"form-control input-sm","data-bind":"value: notify_at_lvl_"+t})),$('<td><span data-bind="text:'+n+'"/></td>')))},l=Object.keys(t).sort()[Symbol.iterator]();!(e=(r=l.next()).done);e=!0)a()}catch(t){n=!0,i=t}finally{try{!e&&l.return&&l.return()}finally{if(n)throw i}}c.applyBindings(o.model,b[0])});var m=$('<div class="col-md-6"/>'),y=$('<div class="col-md-6"/>'),h=$('<ul class="list-group"/>'),_=[{name:"AP",desc:"Notifies you when AP is >= the given percent",ob:"notify_AP_pct"},{name:"HP",desc:"Notifies you when HP is >= the given percent",ob:"notify_HP_pct"}],x=!0,g=!1,C=void 0;try{for(var k,w=function(){var t=k.value,e=o.addInternal(c.pureComputed(function(){return o.model[t.ob]()>0?"text-success":"text-danger"})),n=s();h.append($('<li class="list-group-item"/>').append($("<label/>").attr({for:n,title:t.desc+". Set to 0 to disable."}).text(t.name),$("<input/>").attr({type:"number",min:0,id:n,max:100,style:"width:65px;display:inline-block;margin-left:5px;margin-right:5px",class:"form-control input-sm","data-bind":"textInput:"+t.ob}),$("<span/>").attr("data-bind",["text: "+t.ob+"() > 0 ? 'On' : 'Off'","css: "+e].join(","))))},P=_[Symbol.iterator]();!(x=(k=P.next()).done);x=!0)w()}catch(t){g=!0,C=t}finally{try{!x&&P.return&&P.return()}finally{if(g)throw C}}m.append('<h3 title="Notifies you when you reach a given skill level. Set to 0 to disable">Level notifications</h3>',$('<table class="table table-condensed vertical-middle"/>').append(b)),y.append("<h3>Trigger notifications</h3>",h);var M=t("./open-changelog");$(v).append('<h1 class="text-center">'+e.script.name+" v"+e.script.version+"</h1>",$('<div class="text-center"/>').append($("<button/>").click(M).attr({type:"button",class:"btn btn-xs btn-default"})),"<h3>Notification toggles</h3>",$('<div class="btn-group btn-group-xs">').append(l("notify_captcha","Captcha"),l("notify_timer","Idle")),"<hr/>",m,y);var S=u.remodal({hashTracking:!1});$("#Left_menu").find(">.LeftMenu.LeftMenuLinks.side_block").prepend('<div class="smallchain"/>',$('<div class="toggle" style="text-align:center"><a href="javascript:void(0)">'+e.script.name+" "+e.script.version+"</a></div>").click(function(){S.open()})),c.applyBindings(o.model,v)},{"./model":4,"./open-changelog":12,"./uuid":20}],14:[function(t,e,n){"use strict";var i=new a.sound("https://media.githubusercontent.com/media/AlorelUserscripts/battered-shield-notifier/ca49e2e9ea77b4b067bb91faf78f0f7c6086aa8e/assets/notification.mp3",{preload:!0,autoplay:!1,loop:!1});e.exports={notification:i}},{}],15:[function(t,e,n){"use strict";var i={timeout:3e4},r=t("../notify"),o=t("../model").model;o.apPCT.subscribe(function(t){var e=o.notify_AP_pct();e>0&&t>=e&&r("AP is at "+t+"%",i)})},{"../model":4,"../notify":5}],16:[function(t,e,n){"use strict";var i="Stopped",r=t("../notify"),o=t("../model").model;o.timer.subscribe(function(t){i==t&&o.notify_timer()&&r("Actions finished: "+t)})},{"../model":4,"../notify":5}],17:[function(t,e,n){"use strict";var i=t("../notify"),r={timeout:36e5},o=t("../model").model;o.captcha.subscribe(function(t){t&&o.notify_captcha()&&i("Captcha!",r)})},{"../model":4,"../notify":5}],18:[function(t,e,n){"use strict";var i=t("../notify"),r=t("../model").model,o={timeout:3e4};r.hpPCT.subscribe(function(t){var e=r.notify_HP_pct();e>0&&t>=e&&i("HP at "+t+"%!",o)})},{"../model":4,"../notify":5}],19:[function(t,e,n){"use strict";var i=t("../notify"),r=t("../model");r.ready.skillLevels.then(function(t){var e=r.model,n=function(t){var n=this;t&&(i(n+" has reached the target level of "+e["notify_at_lvl_"+n]()+"!"),e["notify_at_lvl_"+n](0))},o=!0,s=!1,a=void 0;try{for(var l,c=Object.keys(t)[Symbol.iterator]();!(o=(l=c.next()).done);o=!0){var u=l.value;e["lvl_should_notify_"+u].subscribe(n,u),console.debug({skill:u,val:e["lvl_should_notify_"+u]()})}}catch(t){s=!0,a=t}finally{try{!o&&c.return&&c.return()}finally{if(s)throw a}}console.debug("Skill level subscriptions initialised")})},{"../model":4,"../notify":5}],20:[function(t,e,n){"use strict";var i=/[xy]/g,r="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx";e.exports=function(){var t=Date.now();return r.replace(i,function(e){var n=(t+16*Math.random())%16|0;return t=Math.floor(t/16),("x"==e?n:3&n|8).toString(16)})}},{}],21:[function(t,e,n){"use strict";e.exports=function(t,e){function n(t){for(var e=0;e<t.length;++e)if(!isPositiveInteger(t[e]))return!1;return!0}var i=t.split("."),r=e.split(".");if(!n(i)||!n(r))return NaN;for(var o=0;o<i.length;++o){if(r.length===o)return 1;if(i[o]!==r[o])return i[o]>r[o]?1:-1}return i.length!=r.length?-1:0}},{}],22:[function(t,e,n){"use strict";e.exports=/([0-9\.]+)\s*\/\s*([0-9\.]+)/},{}]},{},[1])}(GM_notification,GM_info,GM_getResourceText,GM_registerMenuCommand,GM_getValue,GM_setValue,GM_listValues,buzz,Promise,ko,String,document);
