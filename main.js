const SearchEngine = require('./searchEngine');

const searchEngine = new SearchEngine();
searchEngine.addDoc('doc1');
searchEngine.addDoc('doc2');
searchEngine.addDoc('doc2');

console.log('searching...');
console.log(searchEngine.search("quick qui brole"));

console.log(searchEngine.docStore);

// console.log(JSON.stringify(searchEngine.invertedIndex));
