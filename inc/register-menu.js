const model = require('./model');
const uuid = require('./uuid');

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
    for (let name of Object.keys(levels).sort()) {
        let id = uuid();
        let text = model.addInternal(ko.pureComputed(() => {
            if (model.model[`notify_at_lvl_${name}`]() < 1) {
                return 'Disabled';
            } else if (model.model[`notify_at_lvl_${name}`]() <= model.model[`lvl_${name}`]()) {
                return 'Reached';
            } else {
                return `${model.model[`notify_at_lvl_${name}`]() - model.model[`lvl_${name}`]()} to go!`;
            }
        }));

        let clazz = model.addInternal(ko.pureComputed(() => {
            if (model.model[`notify_at_lvl_${name}`]() < 1) {
                return 'active text-muted';
            } else if (model.model[`notify_at_lvl_${name}`]() <= model.model[`lvl_${name}`]()) {
                return 'success text-success';
            } else {
                return `info text-primary`;
            }
        }));

        $skillLevelContainer.append(
            $(`<tr data-bind="css:${clazz}"/>`).append(
                `<td><label for="${id}">${name.ucFirst()}</label></td>`,
                $('<td/>').append(
                    $('<input/>').attr({
                        type: 'number',
                        id,
                        min: 0,
                        style: 'width:85px',
                        'class': 'form-control input-sm',
                        'data-bind': `value: notify_at_lvl_${name}`
                    })
                ),
                $(`<td><span data-bind="text:${text}"/></td>`)
            )
        );
    }
    ko.applyBindings(model.model, $skillLevelContainer[0]);
});

const $leftColumn = $('<div class="col-md-6"/>');
const $rightColumn = $('<div class="col-md-6"/>');
const $triggeredList = $('<ul class="list-group"/>');

const triggeredItems = [
    {name: 'AP', desc: 'Notifies you when AP is >= the given percent', ob: 'notify_AP_pct'},
    {name: 'HP', desc: 'Notifies you when HP is >= the given percent', ob: 'notify_HP_pct'}
];

for (let spec of triggeredItems) {
    let cssProp = model.addInternal(ko.pureComputed(() => {
        return model.model[spec.ob]() > 0 ? 'text-success' : 'text-danger';
    }));
    let id = uuid();

    $triggeredList.append(
        $('<li class="list-group-item"/>').append(
            $('<label/>').attr({
                'for': id,
                title: `${spec.desc}. Set to 0 to disable.`
            }).text(spec.name),
            $('<input/>').attr({
                type: 'number',
                min: 0,
                id,
                max: 100,
                style: 'width:65px;display:inline-block;margin-left:5px;margin-right:5px',
                'class': 'form-control input-sm',
                'data-bind': `textInput:${spec.ob}`
            }),
            $('<span/>').attr(
                'data-bind',
                [
                    `text: ${spec.ob}() > 0 ? 'On' : 'Off'`,
                    `css: ${cssProp}`
                ].join(',')
            )
        )
    );
}

$leftColumn.append(
    '<h3 title="Notifies you when you reach a given skill level. Set to 0 to disable">Level notifications</h3>',
    $('<table class="table table-condensed vertical-middle"/>').append($skillLevelContainer)
);

$rightColumn.append(
    '<h3>Trigger notifications</h3>',
    $triggeredList
);

$(root).append(
    `<h1 class="text-center">${GM_info.script.name} v${GM_info.script.version}</h1>`,
    '<h3>Notification toggles</h3>',
    $('<div class="btn-group btn-group-xs">')
        .append(
            createNotificationBtn('notify_captcha', 'Captcha'),
            createNotificationBtn('notify_timer', 'Idle')
        ),
    '<hr/>',
    $leftColumn,
    $rightColumn
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