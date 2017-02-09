const model = require('./model');

const createNotificationClick = function () {
    const key = $(this).attr("data-key");
    model.model[key](!model.model[key]());
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

['bs_css1', 'bs_css2']
    .map(GM_getResourceText)
    .map(c => `<style>${c}</style>`)
    .forEach(c => shadow.appendChild($(c)[0]));


shadow.appendChild(
    $('<style>.vertical-middle td{vertical-align:middle!important}</style>')[0]
);
shadow.appendChild(root);

const $skillLevelContainer = $('<tbody/>');

model.ready.skillLevels.then(levels => {
    let i = 0;
    for (let name of Object.keys(levels).sort()) {
        $skillLevelContainer.append(
            $(`<tr data-bind="css:lvl_should_notify_${name}_class"/>`).append(
                `<td><label for="notify_at_lvl_${i}">${name.ucFirst()}</label></td>`,
                $('<td/>').append(
                    $('<input/>').attr({
                        type: 'number',
                        id: `notify_at_lvl_${i}`,
                        min: 0,
                        style: 'width:85px',
                        'class': 'form-control input-sm',
                        'data-bind': `textInput: notify_at_lvl_${name}`
                    })
                ),
                $(`<td><span data-bind="text: lvl_should_notify_${name}_text"/></td>`)
            )
        );
        ++i;
    }
    ko.applyBindings(model.model, $skillLevelContainer[0]);
});

$(root).append(
    `<h1 class="text-center">${GM_info.script.name} v${GM_info.script.version}</h1>`,
    '<h3>Notification toggles</h3>',
    $('<div class="btn-group btn-group-xs">')
        .append(
            createNotificationBtn('notify_captcha', 'Captcha'),
            createNotificationBtn('notify_AP', 'Full AP'),
            createNotificationBtn('notify_HP', 'Full HP'),
            createNotificationBtn('notify_timer', 'Idle')
        ),
    '<hr/>',
    $('<h3 title="Notifies you when you reach a given skill level. Set to 0 to disable">Level notifications</h3>'),
    $('<table class="table table-condensed vertical-middle" style="width:auto"/>').append($skillLevelContainer)
);

const $modal = $modalWrapper.remodal({hashTracking: false});

$("#Left_menu")
    .find(">.LeftMenu.LeftMenuLinks.side_block").prepend(
    '<div class="smallchain"/>',
    $(`<div class="toggle" style="text-align:center"><a href="javascript:void(0)">${GM_info.script.name} options</a></div>`).click(() => {
        $modal.open();
    }),
);

ko.applyBindings(model.model, root);