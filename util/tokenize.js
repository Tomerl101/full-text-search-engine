const natural = require('natural');
const stringSeperator = require('./stringSeperator');
const stopWords = require('../stopWords');

function tokenize(query) {
    let queryTokens = stringSeperator(query);

    const tokenizeQuery = queryTokens.map(t => {
        const token = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        return natural.PorterStemmer.stem(token)
    })
        .filter(st => !stopWords.includes(st));
    return tokenizeQuery;
}
module.exports = tokenize;