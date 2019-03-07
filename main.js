const SearchEngine = require('./searchEngine');

const searchEngine = new SearchEngine();
searchEngine.addDoc('doc1');
searchEngine.addDoc('doc2');
searchEngine.addDoc('doc2');

console.log(JSON.stringify(searchEngine.invertedIndex));

// let doCreateDictionary = require('./middleware/createDictionary');
// const compareWords = require('./util/compareWords');
// let dictionary;

// // indexedDB.add(1)
// async function invertedIndex() {
//   dictionary = await doCreateDictionary();
//   sortDictionary = dictionary.sort(compareWords);
//   console.log(dictionary);
// }

// invertedIndex();