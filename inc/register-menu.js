const model = require('./model').model;

const createNotificationClick = function () {
    const key = $(this).attr("data-key");
    model[key](!model[key]());
};

const createNotificationBtn = (key, label) => {
    return $('<button/>')
        .attr({
            type: 'button',
            'class': 'btn',
            'data-bind': `css: {'btn-danger': !${key}(), 'btn-success': ${key}}`,
            'data-key': key
        }).click(createNotificationClick)
        .append(
            $(`<span>${label}: </span>`),
            $(`<span data-bind="text: ${key}() ? 'Enabled' : 'Disabled'"/>`)
        );
};

const $modalWrapper = $(`<div data-remodal-id="${GM_info.script.name}"><button data-remodal-action="close" class="remodal-close"></button></div>`);

const modalInnerContainer = document.createElement('div');
$modalWrapper.append(modalInnerContainer);

const shadow = modalInnerContainer.createShadowRoot();
const root = $('<div class="container-fluid text-left"/>')[0];

shadow.appendChild($(`<style>${['bs_css1', 'bs_css2'].map(GM_getResourceText).reduce((acc, curr) => acc + curr)}</style>`)[0]);
shadow.appendChild(root);

$(root).append(
    `<h1 class="text-center">${GM_info.script.name} v${GM_info.script.version}</h1>`,
    '<h3>Notification toggles</h3>',
    $('<div class="btn-group btn-group-xs">')
        .append(
            createNotificationBtn('notify_captcha', 'Captcha'),
            createNotificationBtn('notify_AP', 'Full AP'),
            createNotificationBtn('notify_HP', 'Full HP'),
            createNotificationBtn('notify_timer', 'Idle')
        )
);

const $modal = $modalWrapper.remodal({hashTracking: false});

$("#Left_menu")
    .find(">.LeftMenu.LeftMenuLinks.side_block").prepend(
    '<div class="smallchain"/>',
    $(`<div class="toggle" style="text-align:center"><a href="javascript:void(0)">${GM_info.script.name} options</a></div>`).click(() => {
        $modal.open();
    }),
);

ko.applyBindings(model, root);