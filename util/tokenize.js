function tokenize(str) {
    str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    return str;
}
module.exports = tokenize;