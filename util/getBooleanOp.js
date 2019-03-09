const boolean = require('../constants/boolean');

/**
 * extract boolean operator AND, OR, NOT
 * from a given string
 */
function getBooleanOp(str) {
    const strLowerCase = str.toUpperCase();

    if (strLowerCase.includes(boolean.AND)) {
        return boolean.AND;
    } else if (strLowerCase.includes(boolean.OR)) {
        return boolean.OR;
    } else if (strLowerCase.includes(boolean.NOT)) {
        return boolean.NOT;
    }
    return;
}

module.exports = getBooleanOp;