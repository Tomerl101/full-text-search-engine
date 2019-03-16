const cors = require('cors');
const express = require('express');
const searchEngine = require('./searchEngine');
const searchController = require('./controller/search');

searchEngine.addDoc('001');
searchEngine.addDoc('002');
// searchEngine.addDoc('003');
// searchEngine.addDoc('004');
// searchEngine.addDoc('005');

console.log(searchEngine.invertedIndex);

const app = express();

app.use(cors())
app.options('*', cors());
app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/search', searchController.searchQuery);
app.post('/getDocument', searchController.getDocument);
app.post('/addDocument', searchController.addDocument);
app.post('/removeDocument', searchController.removeDocument);

app.listen(8080, () => {
    console.log(`Server running on port 8080`);
});
