const natural = require('natural');
const stringSeperator = require('./stringSeperator');
const stopWords = require('../stopWords');

/**
 * take a string as input and return
 * an array of tokenize words 
 * @param {String} query 
 * @param {boolean} shouldStem 
 */
function tokenize(query, shouldStem) {
    //remove stop words
    let queryTokens = stringSeperator(query)
        .filter(t => !stopWords.includes(t));

    //stem words
    const tokenizeQuery = queryTokens.map(t => {
        const token = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        return shouldStem ? natural.PorterStemmer.stem(token) : token;
    })
    return tokenizeQuery;
}
module.exports = tokenize;