const css = document.createElement('style');
css.textContent = GM_getResourceText('toast_css');

document.body.appendChild(css);

const baseCfg = {
    showHideTransition: 'fade', // fade, slide or plain
    allowToastClose: true, // Boolean value true or false
    hideAfter: 5000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
    stack: 100, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
    bgColor: '#444444',  // Background color of the toast
    textColor: '#eeeeee',  // Text color of the toast
    textAlign: 'left',  // Text alignment i.e. left, right or center
    loader: false,  // Whether to show loader or not. True by default
    loaderBg: '#9EC600',  // Background color of the toast loader
};

module.exports = (msg, cfg) => {
    console.debug(`Toasting: ${msg}`);
    $.toast($.extend({text: msg}, baseCfg, cfg || {}));
};