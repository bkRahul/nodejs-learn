const fs = require('fs');

/* Working with files */


//(filename, data, callback)

// writing to a file

// fs.writeFile('msg.txt', 'Hi i am learning node from past one month', (err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('File has been written')
// })


//append to end of content

// fs.appendFile('msg.txt', '. Have to make progress from today', (err) => {
// 	if (err) {
// 		throw err;
// 		console.log("Text has been appended")
// 	}
// })


//read the content of file

// fs.readFile('./msg.txt', 'utf8', (err, data) => {
//  	if (err) {
//  		throw err;
//  	}else
//  	console.log(data)
//  })


//delete the file

// fs.unlink('msg.txt', (err) => {
// 	if (err) {
// 		throw err;
// 	}
// 	console.log("File has been removed");
// })



/* Working with directories */


//Creating a directory

// let files = ['a.txt', 'b.txt'];

// fs.mkdir('message', (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//     	//add two files inside the directory
//         for (file of files) {
//             fs.writeFile('./message/' + file, 'created '+ file +' inside a directory', (err) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log('File has been written')
//                 }
//             })
//         }
//     }
// })


//read the directory

// fs.readdir('message', (err, files) => {
// 	if (err) {
// 		console.log(err)
// 	}else {
// 		console.log(files);
// 	}
// })


//Removing a directory

// fs.readdir('message', (err, files) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(files);
//         //remove files inside the directory
//         for (file of files) {
//             fs.unlink('./message/' + file, (err) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log("File has been removed");
//                 }
//             });
//         }
//         fs.rmdir('message', (err) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log("Directory has been removed");
//             }
//         });
//     }
// });



/* Working with filestreams */


//writing to a file in chunks

// const readStream = fs.createReadStream('lorem.txt', 'utf-8');
// const writeStream = fs.createWriteStream('loremWrite.txt');
// readStream.on('data', (chunk) => {
// 	writeStream.write(chunk);
// });



/* Working with compression */

//zip folder

// const zlib = require('zlib');
// const gzip = zlib.createGzip()
// const readStream = fs.createReadStream('lorem.txt', 'utf-8');
// const writeStream = fs.createWriteStream('loremChanged.txt.gz');

// readStream.pipe(gzip).pipe(writeStream);


// unzip folder

const zlib = require('zlib');
const gunzip = zlib.createGunzip()
const readStream = fs.createReadStream('loremChanged.txt.gz');
const writeStream = fs.createWriteStream('loremUncompressed.txt');

readStream.pipe(gunzip).pipe(writeStream);