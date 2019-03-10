const cors = require('cors');
const express = require('express');
const searchEngine = require('./searchEngine');

// const searchEngine = new SearchEngine();
searchEngine.addDoc('001');
searchEngine.addDoc('002');
searchEngine.addDoc('003');
searchEngine.addDoc('004');
searchEngine.addDoc('005');

//TODO: REMOVE DOCS FROM DOCS STORE WHEN REMOVE FILE!!!!
//TODO: copy file from dest to src
console.log(searchEngine.search("noa OR moral"));

const app = express();

app.use(cors())
app.options('*', cors());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.get('/search', searchQuery);

app.all('*', (req, res) => {
    res.redirect('/');
});

app.listen(8080, () => {
    console.log(`Server runing on port 8080`);
});

// searchEngine.removeDoc('003');
// searchEngine.removeDoc('004');


// console.log(searchEngine.search('(qui OR (brole AND tomer))'));
// console.log(searchEngine.search("(Moral AND (tomer OR (crime OR town)))"));
// console.log(searchEngine.search("((Moral AND noa) OR Tomer) NOT water"));
// const set = searchEngine.search("noa");
// console.log('set--->', set);
// console.log(JSON.stringify(searchEngine.invertedIndex));
// console.log(searchEngine.docStore);

// console.log(searchEngine.docStore[set.])
// console.log(searchEngine.search("'tomer and noa'"));

// console.log(JSON.stringify(searchEngine.invertedIndex));
