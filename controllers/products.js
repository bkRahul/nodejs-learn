const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  //accepts data as object which is passed to the template
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
  //  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
};

const postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.saveProduct();
  res.redirect("/");
};

const getProducts = (req, res, next) => {
  Product.fetchAllProduct(products => {
    res.render("shop", { productData: products, pageTitle: "Shop", path: "/" });
  });
};

module.exports.getAddProduct = getAddProduct;
module.exports.postAddProduct = postAddProduct;
module.exports.getProducts = getProducts;
