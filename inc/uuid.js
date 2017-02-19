const regex = /[xy]/g;
const base = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';

module.exports = () => {
    let d = Date.now();

    return base.replace(regex, c => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};