const SearchEngine = require('./searchEngine');

const searchEngine = new SearchEngine();
searchEngine.addDoc('001');
searchEngine.addDoc('002');
searchEngine.addDoc('003');
searchEngine.addDoc('004');
searchEngine.addDoc('005');
// searchEngine.removeDoc('003');
// searchEngine.removeDoc('004');


// console.log(searchEngine.search('(qui OR (brole AND tomer))'));
// console.log(searchEngine.search("(Moral AND (tomer OR (crime OR town)))"));
// console.log(searchEngine.search("((Moral AND noa) OR Tomer) NOT water"));
// console.log(searchEngine.search("NOT (Noa and tomer)"));
// console.log(JSON.stringify(searchEngine.invertedIndex));
console.log(searchEngine.docStore);
// console.log(searchEngine.search("'tomer and noa'"));

// console.log(JSON.stringify(searchEngine.invertedIndex));
