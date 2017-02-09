const getLevels = require('../get-levels');
const model = require('../model');

const then = levels => {
    let m = model.model;
    for (let k of Object.keys(levels)) {
        m[`lvl_${k}`](levels[k]);
    }
};

model.ready.skillLevels.then(() => {
    console.debug('Skill level observer initialised');
    new MutationObserver(() => getLevels().then(then))
        .observe(
            $("#Profile_Tabs").find(".SkillHolder")[0],
            require('./settings.json')
        );
});