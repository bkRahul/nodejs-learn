const path = require("path");
const fs = require("fs");

const util = require("../utils/util");

class Cart {

  static addProduct(id, price) {
    this.id = new Date().getTime().toString();
    const filePath = path.join(util.rootDir, "database", "cart.json");

    fs.readFile(filePath, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(data);
        console.log("File has been read");
      }
      let existingProductIndex = cart.products.findIndex(
        (item) => item.id === id
      );
      let existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        if (err) {
          throw err;
        } else {
          console.log("File has been written");
        }
      });
    });
  }

  static fetchCart(cb) {
    const filePath = path.join(util.rootDir, "database", "cart.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(data));
    });
  }

  static deleteProduct(id, price) {
    const filePath = path.join(util.rootDir, "database", "cart.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.log("Failed to delete product");
        return null;
      } else {
        let updatedCart = { ...JSON.parse(data) };
        console.log("updatedCart cart =>>", updatedCart);
        let product = updatedCart.products.find((item) => item.id === id);
        if (!product) {
          return;
        }
        updatedCart.totalPrice =
          updatedCart.totalPrice - price * product.qty;
        updatedCart.products = updatedCart.products.filter(
          (item) => item.id !== id
        );
        console.log("updatedCart cart=>>", updatedCart);
        fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
          if (err) {
            throw err;
          } else {
            console.log("File has been written");
          }
        });
      }
    });
  }
  
}

module.exports = Cart;
