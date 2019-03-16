const searchEngine = require('../searchEngine');
const readJson = require('../util/readJson');

const searchQuery = async (req, res) => {
    try {
        const { query } = req.body;
        const result = await searchEngine.search(query);
        console.log(result);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json(body);
    }

}

const addDocument = (req, res) => {
    try {
        const { docId } = req.body;
        searchEngine.addDoc(docId);
        res.status(200).json({ result: 'add document successfuly' });
    } catch (e) {
        res.status(400).json({ result: 'add document not succeed' });
    }

}

const removeDocument = (req, res) => {
    try {
        const { docId } = req.body;
        searchEngine.removeDoc(docId);
        res.status(200).json({ result: 'remove document successfuly' });
    } catch (e) {
        res.status(400).json({ result: 'add document not succeed' });
    }

}

const getDocument = (req, res) => {
    try {
        const { docId } = req.body;
        const result = readJson(docId);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ e });
    }
}


module.exports = {
    searchQuery: searchQuery,
    addDocument: addDocument,
    removeDocument: removeDocument,
    getDocument: getDocument
}
