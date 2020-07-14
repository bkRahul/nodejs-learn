//const rootDir = require('../utils/path');
const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
  //    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
};

const postAddProduct = (req, res, next) => {
  new Product(req.body.title).saveProduct({
    title: req.body.title,
  });
  res.redirect("/");
};

const getProducts = (req, res, next) => {
  const products = Product.fetchAllProduct();
  console.log("products=>>>", products);

  //accepts data as object which is passed to the template
  res.render("shop", { productData: products, pageTitle: "Shop", path: "/" });
  //  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
};

module.exports.getAddProduct = getAddProduct;
module.exports.postAddProduct = postAddProduct;
module.exports.getProducts = getProducts;
