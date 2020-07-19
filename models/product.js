const path = require("path");
const fs = require("fs");

const util = require("../utils/util");
const Cart = require("./cart");

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  saveProduct() {
    const dirPath = path.join(util.rootDir, "database");
    const filePath = path.join(util.rootDir, "database", "products.json");
    console.log("thissssssss=>>", this);
    fs.readFile(filePath, (err, data) => {
      let products = [];
      if (!err) {
        products = JSON.parse(data);
        console.log("File has been read");
      }

      if (this.id) {
        const existingProductIndex = products.findIndex(
          (item) => item.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
          if (err) {
            throw err;
          } else {
            console.log("File has been written");
          }
        });
      } else {
        this.id = new Date().getTime().toString();
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
      }
    });
  }

  static findById(id, cb) {
    const filePath = path.join(util.rootDir, "database", "products.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        cb([]);
      }

      let parsedArray = JSON.parse(data);
      let product = parsedArray.find((item) => item.id === id);
      cb(product);
    });
  }

  static deleteProduct(id) {
    const filePath = path.join(util.rootDir, "database", "products.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.log("Failed to delete product");
        return null;
      } else {
        let parsedArray = JSON.parse(data);
        let product = parsedArray.find((item) => item.id === id);
        let filteredProducts = parsedArray.filter((item) => item.id !== id);
        fs.writeFile(filePath, JSON.stringify(filteredProducts), (err) => {
          if (err) {
            throw err;
          } else {
            Cart.deleteProduct(id, product.price);
            console.log("File has been written");
          }
        });
      }
    });
  }

  static fetchAllProduct(cb) {
    const filePath = path.join(util.rootDir, "database", "products.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(data));
    });
  }
}

module.exports = Product;
