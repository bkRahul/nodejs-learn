const Product = require("../models/product");

const getIndex = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/index", {
      productData: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

const getProducts = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/products", {
      productData: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

const getCart = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/cart", {
      productData: products,
      pageTitle: "Cart",
      path: "/cart",
    });
  });
};

const getCheckout = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/checkout", {
      productData: products,
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
};

module.exports = {
  getIndex: getIndex,
  getProducts: getProducts,
  getCart: getCart,
  getCheckout: getCheckout,
};
