const path = require('path');
//require the path module

const fileLocation = path.join(__filename)
//get file location

const fileName = path.basename(fileLocation)
//get filename

const fileExt = path.extname(fileLocation)
//get file extension

const fileDir = path.dirname(fileLocation)
//get file directory

console.log(fileDir)