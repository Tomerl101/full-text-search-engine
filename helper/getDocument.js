//1. get docId 
//2. read document
//3. highlight word

const readJson = require('../util/readJson');

function getDocument(docId, searchWords) {
    const data = readJson(docId);

    hightLightData = data.body.split(" ").map(w => {
        return searchWords.includes(w) ? `<span class='high-light'>${w}</span>` : w
    }).join(" ")

    return hightLightData;
}

module.exports = getDocument;