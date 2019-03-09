const readJson = require('./util/readJson');
const tokenize = require('./util/tokenize');
const queryPriority = require('./util/queryPriority');

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

      if (this.isDocExist(id)) {
        console.log('file already exist');
        return;
      }

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

  removeDoc(docId) {
    try {
      const { id, title, body } = readJson(docId);
      const words = tokenize(body);
      let wordPostingList;

      words.forEach(word => {
        wordPostingList = this.invertedIndex[word];
        if (wordPostingList) {
          delete wordPostingList.docs[id];
          wordPostingList.df -= 1;
          //remove word from inverted index if word posting is empty
          if (wordPostingList.df == 0) {
            delete this.invertedIndex[word];
          }
        }
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  search(searchQuery) {
    let QueryDocs = {};
    if (!searchQuery) {
      return;
    }

    const queryOrderByPriorty = queryPriority(searchQuery);

    console.log("queryOrderByPriorty", queryOrderByPriorty);
    return;

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
    if (word && this.invertedIndex[word]) {
      return this.invertedIndex[word].docs;
    }
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

  isDocExist(docId) {
    return !!this.docStore[docId];
  }
}

module.exports = SearchEngine;