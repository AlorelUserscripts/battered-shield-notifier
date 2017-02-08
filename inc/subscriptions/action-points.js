const auraBtn = document.querySelector(`#Left_menu a[href="javascript:PopupHandler.Popup('Cast');"] div[data-selector]`)
    || document.createElement("span");
const options = {
    onclick: () => {
        auraBtn.click();
    }
};
const notify = require('../notify');
const model = require('../model').model;

model.apPCT.subscribe(v => {
    if (v >= 100.0 && model.notify_AP()) {
        notify('AP full!', options);
    }
});