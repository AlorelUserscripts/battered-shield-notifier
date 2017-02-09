const getLevels = require('../get-levels');
const model = require('../model').model;

const then = levels => {
    for (let k of Object.keys(levels)) {
        model[`lvl_${k}`](levels[k]);
    }
};

getLevels.ready.then(() => {
    console.debug('Skill level observer initialised');
    new MutationObserver(() => getLevels().then(then))
        .observe($("#Profile_Tabs").find(".SkillHolder")[0], require('./settings.json'));
});