const natural = require('natural');
const readJson = require('./util/readJson');
const stringSeperator = require('./util/stringSeperator');
const stopWords = require('./stopWords');
const tokenize = require('./util/tokenize');

class SearchEngine {
  constructor() {
    this.invertedIndex = {};
  }

  /**
   * for a given file name we take
   * every word , tokenize and stem it 
   * and add it to the inverted file
   * we ignore any stopwords in the file
   * @param {string} fileName 
   */
  addDoc(fileName) {
    try {
      const wordCount = {};
      const { id, title, body } = readJson(fileName);
      const words = stringSeperator(body);

      //tokenize, stemming and remove stop words
      const stemTokens = words.map(w => {
        const token = tokenize(w);
        return natural.PorterStemmer.stem(token)
      })
        .filter(w => !stopWords.includes(w));

      stemTokens.forEach(w => w in wordCount ? wordCount[w] += 1 : wordCount[w] = 1)

      //add word to the inverted index
      for (let word in wordCount) {
        const termFrequency = wordCount[word];
        this.addWord(word, { docId: id, tf: termFrequency });
      }
    } catch (error) {
      console.log(error);
    }
    return;
  }


  /**
   * add a word to the inverted index
   * if already exist then we update the wordInfo 
   * @param {string} word 
   * @param {docId:id, tf: termFrequency} wordInfo 
   * */
  addWord(word, wordInfo) {
    const invertedIndex = this.invertedIndex;
    if (!(word in invertedIndex)) {
      invertedIndex[word] = { docs: {}, df: 0 };
    }
    let wordPostingList = this.invertedIndex[word]

    let { docId } = wordInfo;
    // if this doc not exist, then add this doc
    wordPostingList.docs[docId] = { tf: wordInfo.tf };
    wordPostingList.df += 1;
  }

  removeDoc() {

  }

  search() {

  }
}

module.exports = SearchEngine;


//DEPRECATED
// addWord(word, wordInfo) {
//   var invertedIndex = this.invertedIndex;
//   let idx = 0;

//   //search for the word in the invertedIndex e.g: q-> qu -> qui..
//   while (idx <= word.length - 1) {
//     var key = word[idx];
//     if (!(key in invertedIndex)) {
//       invertedIndex[key] = { docs: {}, df: 0 };
//     }
//     idx += 1;
//     invertedIndex = invertedIndex[key];
//   }

//   let { docId } = wordInfo;
//   if (!invertedIndex.docs[docId]) {
//     // if this doc not exist, then add this doc
//     invertedIndex.docs[docId] = { tf: wordInfo.tf };
//     invertedIndex.df += 1;
//   } else {
//     // if this doc already exist , then update wordInfo
//     invertedIndex.docs[docId] = { tf: wordInfo.tf };
//   }
//   console.log(JSON.stringify(this.invertedIndex));
// }