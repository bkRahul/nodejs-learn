const path = require("path");
const fs = require("fs");

//get root folder directory by using filepath of the entry module
const rootDir = path.dirname(process.mainModule.filename);

const createDirectory = (directory) => {
  return new Promise((resolve, reject) => {
    fs.exists(directory, (exist) => {
      if (!exist) {
        fs.mkdir(directory, (err) => {
          if (err) {
            console.log("directory could not be created");
            reject(err);
          } else {
            resolve("directory created successfully");
          }
        });
      } else {
        resolve("directory already created");
      }
    });
  });
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  })
}

module.exports.rootDir = rootDir;
module.exports.createDirectory = createDirectory;
module.exports.deleteFile = deleteFile;
