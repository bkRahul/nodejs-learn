const fs = require('fs');

//(filename, data, callback)
fs.writeFile('.gitignore', 'node_modules', (err) => {
    if (err) {
        throw err;
    }
    console.log('File has been written')
})

// fs.readFile('./msg.txt', 'utf8', (err, data) => {
//  	if (err) {
//  		throw err;
//  	}else
//  	console.log(data)
//  })