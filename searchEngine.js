const readJson = require('./util/readJson');
const tokenize = require('./util/tokenize');
const queryPriority = require('./util/queryPriority');
const getBooleanOp = require('./util/getBooleanOp');
const boolean = require('./constants/boolean');
const union = require('./util/union');
const intersection = require('./util/intersection');

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

  /**
   * search user query string 
   * the function will extract boolean operator (AND,OR,NOT)
   * and return the files that conatin the words in 
   * the query.
   * the default search operator is OR
   * @param {string} searchQuery 
   */
  search(searchQuery) {
    let docsSet = new Set();

    if (!searchQuery) {
      return;
    }

    const queryOrderByPriorty = queryPriority(searchQuery);

    queryOrderByPriorty.forEach(query => {
      const booleanOp = getBooleanOp(query);
      const tokenizeQuery = tokenize(query);

      console.log('query', query);
      switch (booleanOp) {
        case boolean.AND:
          docsSet = this.searchAND(tokenizeQuery, docsSet);
          break;
        case boolean.OR:
          docsSet = this.searchOR(tokenizeQuery, docsSet);
          break;
        case boolean.NOT:
          docsSet = this.searchNOT(tokenizeQuery, docsSet);
          break;
      }
      console.log('docsSets', docsSet);
    })
    return docsSet;
  }

  /**
   * return list of documents
   * that the word appear in them
   * @param {string} word 
   */
  getDocs(word) {
    if (word && this.invertedIndex[word]) {
      return Object.keys(this.invertedIndex[word].docs);
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

  isWordExist(word) {
    return word && this.invertedIndex[word] ? true : false
  }

  searchAND(tokenizeQuery, docsSet) {
    let _docsSet = docsSet;
    if (tokenizeQuery.length == 1) {
      const [token1] = tokenizeQuery;
      let setA = new Set(this.getDocs(token1));
      if (docsSet.size == 0) {
        _docsSet = {};
      } else {
        _docsSet = intersection(_docsSet, setA);
      }
    } else {
      const [token1, token2] = tokenizeQuery;
      let setA = this.getDocs(token1);
      let setB = this.getDocs(token2);
      _docsSet = intersection(setA, setB);
    }
    return _docsSet;
  }

  searchOR(tokenizeQuery, docsSet) {
    let _docsSet = docsSet;
    if (tokenizeQuery.length == 1) {
      const [token1] = tokenizeQuery;
      _docsSet = union(_docsSet, this.getDocs(token1));
    } else {
      const [token1, token2] = tokenizeQuery;
      _docsSet = union(this.getDocs(token1), this.getDocs(token2));
    }
    return _docsSet;
  }
}

module.exports = SearchEngine;