const SearchEngine = require('./searchEngine');

const searchEngine = new SearchEngine();
searchEngine.addDoc('001');
searchEngine.addDoc('002');
searchEngine.addDoc('003');
searchEngine.addDoc('004');

searchEngine.removeDoc('003');
searchEngine.removeDoc('004');

console.log(searchEngine.search('(qui OR (brole AND tomer))'));
console.log(searchEngine.search("qui"));

console.log(JSON.stringify(searchEngine.invertedIndex));
console.log(searchEngine.docStore);

// console.log(JSON.stringify(searchEngine.invertedIndex));
