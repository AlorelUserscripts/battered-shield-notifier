const model = require('../model');

model.ready.skillLevels.then(() => {
    const $tl = $("#mainContainer").find(".timer_line");
    const m = model.model;
    const $level = $tl.find(".Level")[0];
    const $skill = $tl.find(".Skill")[0];
    const settings = require('./settings.json');

    const mo = new MutationObserver(() => {
        if ($level && $skill) {
            let level = $level.textContent;
            let skill = $skill.textContent;

            if (level && skill) {
                m[`lvl_${skill.trim().toLowerCase()}`](parseInt(level.trim()));
            }
        }
    });

    mo.observe($level.parentNode, settings);
    console.debug('Skill level observer initialised');
});