function difference(a, b) {
    return new Set(Object.keys(a).filter(docId => !b.has(docId)));
}

module.exports = difference;