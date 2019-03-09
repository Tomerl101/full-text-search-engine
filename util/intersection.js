function intersection(a, b) {
    return new Set([...a].filter(i => b.includes(i)));
}

module.exports = intersection;