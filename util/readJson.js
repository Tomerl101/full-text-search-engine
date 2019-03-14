const fs = require('fs');
const PATH = './storage/dest/'

function readJson(fileName) {
    try {
        const obj = JSON.parse(fs.readFileSync(PATH + `${fileName}.json`, 'utf8'));
        return obj;
    } catch (e) {
        throw (`file cannot find`);
    }
}

module.exports = readJson;