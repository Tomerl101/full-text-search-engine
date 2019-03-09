const fs = require('fs');
const PATH = './data/'

function readJson(fileName) {
    try {
        const obj = JSON.parse(fs.readFileSync(PATH + `${fileName}.json`, 'utf8'));
        return obj;
    } catch (e) {
        throw (`file doesn't exist`);
    }
}

module.exports = readJson;