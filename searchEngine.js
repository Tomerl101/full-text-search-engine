const readJson = require('./util/readJson');
const tokenize = require('./util/tokenize');

class SearchEngine {
  constructor() {
    this.invertedIndex = {};
    this.docStore = {};
  }

  /**
   * for a given file name we take
   * every word , tokenize and stem it 
   * and add it to the inverted file
   * we ignore any stopwords in the file
   * @param {string} docId 
   */
  addDoc(docId) {
    try {
      const wordCount = {};
      const { id, title, body } = readJson(docId);

      const tokenizeQuery = tokenize(body);
      this.docStore[id] = this.getDocLength(body);
      tokenizeQuery.forEach(w => w in wordCount ? wordCount[w] += 1 : wordCount[w] = 1)

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

  search(searchQuery) {
    let QueryDocs = {};
    if (!searchQuery) {
      return;
    }
    const tokenizeQuery = tokenize(searchQuery);
    tokenizeQuery.forEach(w => {
      QueryDocs[w] = this.getDocs(w)
    })
    return QueryDocs;
  }

  /**
   * return list of documents
   * that the word appear in them
   * @param {string} word 
   */
  getDocs(word) {
    return this.invertedIndex[word].docs;
  }

  /**
   * return total word count
   * of a specific document
   * @param {string} doc 
   */
  getDocLength(doc) {
    if (!doc) {
      return;
    }
    return doc.split(" ").length
  }

  /**
   * get the number of documents
   * that added to the inverted index
   */
  get docStoreLength() {
    return Object.keys(this.docStore).length;
  }
}

module.exports = SearchEngine;