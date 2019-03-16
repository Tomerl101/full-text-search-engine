const fs = require('fs');

function moveFile(src, dest, fileName) {
    try {
        fs.renameSync(src + `${fileName}.json`, dest + `${fileName}.json`);
    } catch (error) {
        // console.log('file already in dest');
    }
}

module.exports = moveFile;