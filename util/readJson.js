const fs = require('fs');
const PATH = './data/'

function readJson(fileName) {
    const obj = JSON.parse(fs.readFileSync(PATH + `${fileName}.json`, 'utf8'));
    return obj;
}

module.exports = readJson;