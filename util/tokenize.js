const natural = require('natural');
const stringSeperator = require('./stringSeperator');
const stopWords = require('../stopWords');

function tokenize(query) {
    //remove stop words
    let queryTokens = stringSeperator(query)
        .filter(t => !stopWords.includes(t));

    //stem words
    const tokenizeQuery = queryTokens.map(t => {
        const token = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        return natural.PorterStemmer.stem(token)
    })
    return tokenizeQuery;
}
module.exports = tokenize;