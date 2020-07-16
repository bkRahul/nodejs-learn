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

const getSingleProduct = (req, res, next) => {
  const id = req.params.id;
  Product.fetchSingleProduct(id, product => {
    res.render("shop/product-detail", {
      productData: product,
      pageTitle: "Single Products",
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

const postCart = (req, res, next) => {
  console.log("postCart=>>>", req.body.id);
  res.redirect('/');
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
  getSingleProduct: getSingleProduct,
  getCart: getCart,
  postCart: postCart,
  getCheckout: getCheckout,
};
