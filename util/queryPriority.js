function queryPriority(expression, queryArr = []) {
    let leftArr = [];
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === '(') {
            leftArr.push(i);
        }

        let leftArrLength = leftArr.length;
        //fail fast when we see close brack before open bracket
        if (leftArrLength == 0 && expression[i] == ')') {
            return null;
        }

        //add a query that is wrap with brackets
        if (leftArrLength > 0 && expression[i] === ')') {
            const start = leftArr.pop();
            query = expression.slice(start + 1, i)
            queryArr.push(expression.slice(start + 1, i).trim());
            expression = expression.replace(`(${query})`, "");
            queryArr = queryPriority(expression, queryArr);
            return queryArr;
            //add a query that isn't wrap inside brackets
        } else if (leftArrLength == 0 && i + 1 == expression.length) {
            queryArr.push(expression.trim());
            //return null if there is open bracket but no closing bracket
        } else if (leftArrLength > 0 && i + 1 == expression.length) {
            console.log('invalid query string');
            return null;
        }
    }
    return queryArr;
}

module.exports = queryPriority