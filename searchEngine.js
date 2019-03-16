const readJson = require('./util/readJson');
const moveFile = require('./util/moveFile')
const tokenize = require('./util/tokenize');
const queryPriority = require('./util/queryPriority');
const getBooleanOp = require('./util/getBooleanOp');
const boolean = require('./constants/boolean');
const union = require('./util/union');
const intersection = require('./util/intersection');
const difference = require('./util/difference');
const searchError = require('./constants/errors');

const OLD_PATH = './storage/src/'
const NEW_PATH = './storage/dest/';
class SearchEngine {
  constructor() {
    if (!SearchEngine.instance) {
      this.invertedIndex = {};
      this.docStore = {};
      this.queryWordsList = new Set();
      SearchEngine.instance = this;

    }
    return SearchEngine.instance;
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
      if (this.isDocExist(docId)) {
        console.log('file already exist');
        return;
      }

      moveFile(OLD_PATH, NEW_PATH, docId);
      const wordCount = {};
      const { id, title, body } = readJson(docId);
      const tokenizeQuery = tokenize(body, true)

      this.docStore[id] = { title, length: this.getDocLength(body) };
      tokenizeQuery.forEach(w => w in wordCount ? wordCount[w] += 1 : wordCount[w] = 1)

      //add word to the inverted index
      for (let word in wordCount) {
        const termFrequency = wordCount[word];
        this.addWord(word, { docId: id, tf: termFrequency });
      }
    } catch (error) {
      console.log(error);
    }
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
      const words = tokenize(body, true);
      let wordPostingList;
      words.forEach(word => {
        wordPostingList = this.invertedIndex[word];
        if (wordPostingList && wordPostingList.docs[id]) {
          delete wordPostingList.docs[id];
          wordPostingList.df -= 1;
          //remove word from inverted index if word posting is empty
          if (wordPostingList.df == 0) {
            delete this.invertedIndex[word];
          }
        }
      });
      delete this.docStore[id];
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
    let result = {};
    let docsSet = new Set();
    this.queryWordsList.clear();

    if (!searchQuery || searchQuery == "") {
      return {};
    }

    if (Object.keys(this.docStore).length == 0) {
      return result;
    }

    const queryOrderByPriorty = queryPriority(searchQuery);

    if (!queryOrderByPriorty) {
      return searchError.INVALID_QUERY;
    }
    queryOrderByPriorty.forEach(query => {
      console.log('the query->', query);
      const booleanOp = getBooleanOp(query);
      const tokenizeQuery = tokenize(query, true);
      console.log('tokenizeQuery->', tokenizeQuery)
      tokenize(query).forEach((word) => this.queryWordsList.add(word));

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
        default:
          if (!tokenizeQuery) {
            break;
          }
          console.log('inside -->', tokenizeQuery);
          docsSet = new Set(this.getDocs(tokenizeQuery));
      }
      console.log('the documents->', docsSet);

    })

    result.docs = [];
    result.words = [...this.queryWordsList];
    docsSet.forEach(doc => {
      result.docs.push({ docId: doc, title: this.docStore[doc].title })
    });
    return result;
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
      // this.queryWordsList.add(token1);
      let setA = new Set(this.getDocs(token1));
      if (docsSet.size == 0) {
        _docsSet = {};
      } else {
        _docsSet = intersection(_docsSet, setA);
      }
    } else {
      const [token1, token2] = tokenizeQuery;
      // this.queryWordsList.add(token1);
      // this.queryWordsList.add(token2);
      let setA = new Set(this.getDocs(token1));
      let setB = new Set(this.getDocs(token2));
      _docsSet = intersection(setA, setB);
    }
    return _docsSet;
  }

  searchOR(tokenizeQuery, docsSet) {
    let _docsSet = docsSet;
    if (tokenizeQuery.length == 1) {
      const [token1] = tokenizeQuery;
      // this.queryWordsList.add(token1);
      const setA = new Set(this.getDocs(token1));
      _docsSet = union(_docsSet, setA);
    } else {
      const [token1, token2] = tokenizeQuery;
      // this.queryWordsList.add(token1);
      // this.queryWordsList.add(token2);
      const setA = new Set(this.getDocs(token1));
      const setB = new Set(this.getDocs(token2));
      _docsSet = union(setA, setB);
    }
    return _docsSet;
  }

  searchNOT(tokenizeQuery, docsSet) {
    let _docsStore = this.docStore;
    let _docsSet = docsSet;
    if (tokenizeQuery.length == 1) {
      const [token] = tokenizeQuery;
      const setA = new Set(this.getDocs(token));
      _docsSet = difference(_docsStore, setA);
      return _docsSet;
    }
    else {
      _docsSet = difference(_docsStore, _docsSet);
      return _docsSet;
    }
  }
}

//search engine singleton 
const instance = new SearchEngine();
Object.freeze(instance);

module.exports = instance;