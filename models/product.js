const path = require("path");
const fs = require("fs");

const util = require("../utils/util");

class Product {
  constructor(title) {
    this.title = title;
  }

  saveProduct() {
    const dirPath = path.join(util.rootDir, "productsData");
    const filePath = path.join(util.rootDir, "productsData", "products.json");

    fs.readFile(filePath, (err, data) => {
      let products = [];
      if (!err) {
        products = JSON.parse(data);
        console.log("File has been read");
      }
      products.push(this);
      util.createDirectory(dirPath).then(() => {
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          if (err) {
            throw err;
          } else {
            console.log("File has been written");
          }
        });
      });
    });
  }

  static fetchAllProduct(cb) {
    const filePath = path.join(util.rootDir, "productsData", "products.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(data));
    });
  }
}

module.exports = Product;
