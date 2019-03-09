const SearchEngine = require('./searchEngine');

const searchEngine = new SearchEngine();
// searchEngine.addDoc('0ff01');
searchEngine.addDoc('002');
searchEngine.addDoc('002');
searchEngine.addDoc('003');
searchEngine.addDoc('004');

console.log('searching...');
console.log(searchEngine.search("quick qui brole"));
console.log("before remove: ", searchEngine.docStore);


console.log(searchEngine.invertedIndex);

// console.log(JSON.stringify(searchEngine.invertedIndex));
