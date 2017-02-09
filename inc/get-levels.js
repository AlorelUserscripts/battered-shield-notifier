const $parent = $("#Profile_Tabs").find(".SkillHolder");

const map = function () {
    const self = $(this);

    return {
        name: self.find(">.name>span").text().trim(),
        level: parseInt(self.find(">.level>.Level").text().trim())
    };
};

const reduce = (acc, curr) => {
    acc[curr.name] = curr.level;
    return acc;
};

const findDivs = () => $parent.find(">div");

console.time("Waiting for levels DOM");
const ready = new Promise((resolve) => {
    const interval = setInterval(() => {
        if (findDivs().length >= 12) {
            console.timeEnd("Waiting for levels DOM");
            clearInterval(interval);
            resolve();
        }
    }, 25);
});

const then = () => {
    return $.makeArray($parent.find(">div").map(map)).reduce(reduce, {});
};

module.exports = () => ready.then(then);

module.exports.ready = ready;