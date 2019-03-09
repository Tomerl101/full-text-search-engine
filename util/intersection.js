function intersection(a, b) {
    return new Set([...a].filter(i => b.has(i)));
}

module.exports = intersection;