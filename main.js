const cors = require('cors');
const express = require('express');
const searchEngine = require('./searchEngine');
const searchController = require('./controller/search');

searchEngine.addDoc('001');
searchEngine.addDoc('002');
// searchEngine.addDoc('003');


//TODO: REMOVE DOCS FROM DOCS STORE WHEN REMOVE FILE!!!!

// console.log(searchEngine.docStore);
// console.log(JSON.stringify(searchEngine.invertedIndex));

const app = express();

app.use(cors())
app.options('*', cors());
app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/search', searchController.searchQuery);
app.post('/getDocument', searchController.getDocument);

app.listen(8080, () => {
    console.log(`Server running on port 8080`);
});
