function stringSeperator(str) {
    return str.toString().trim().toLowerCase().split(/[\s\-]+/);
};

module.exports = stringSeperator;