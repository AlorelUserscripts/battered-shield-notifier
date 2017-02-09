const model = require('../model');

model.ready.skillLevels.then(() => {
    const $tl = $("#mainContainer").find(".timer_line");
    const m = model.model;
    const $level = $tl.find(".Level")[0];
    const $skill = $tl.find(".Skill")[0];
    const settings = require('./settings.json');

    const mo = new MutationObserver(() => {
        m[`lvl_${$skill.textContent.trim().toLowerCase()}`](parseInt($level.textContent.trim()));
    });

    mo.observe($level, settings);
    console.debug('Skill level observer initialised');
});