const cors = require('cors');
const express = require('express');
const searchEngine = require('./searchEngine');
const searchController = require('./controller/search');



// const searchEngine = new SearchEngine();
searchEngine.addDoc('001');
// searchEngine.removeDoc('001');

searchEngine.addDoc('002');
searchEngine.removeDoc('001');

searchEngine.addDoc('003');
// searchEngine.removeDoc('003');

// searchEngine.addDoc('004');
// searchEngine.addDoc('005');

//TODO: REMOVE DOCS FROM DOCS STORE WHEN REMOVE FILE!!!!
//TODO: copy file from dest to src
console.log(searchEngine.search("((world or money)and tomer) or talents "));

// console.log(searchEngine.search("tomer"));
// console.log(searchEngine.docStore);
// console.log(searchEngine.invertedIndex);

const app = express();

app.use(cors())
app.options('*', cors());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/search', searchController.searchQuery);

app.listen(8080, () => {
    console.log(`Server running on port 8080`);
});
