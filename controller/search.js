const searchEngine = require('../searchEngine');

const searchQuery = async (req, res) => {
    try {
        const { query } = req.body;
        const result = await searchEngine.search(query);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json(body);
    }

}

const addDocument = async (req, res) => {
    try {
        const { docId } = req.body;
        const result = await searchEngine.addDoc(docId);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json(body);
    }

}

const removeDocument = async (req, res) => {
    try {
        const { docId } = req.body;
        const result = await searchEngine.removeDoc(docId);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json(body);
    }

}

const getDocument = async (req, res) => {

}


module.exports = {
    searchQuery: searchQuery,
    addDocument: addDocument,
    removeDocument: removeDocument,
}
