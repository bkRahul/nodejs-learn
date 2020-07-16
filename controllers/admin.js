const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  //accepts data as object which is passed to the template
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
  //  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
};

const postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title, req.body.imageUrl, req.body.description, req.body.price);
  product.saveProduct();
  res.redirect("/");
};

const getProducts = (req, res, next) => {
    Product.fetchAllProduct((products) => {
      res.render("admin/products", {
        productData: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    });
  };

module.exports = {
    getAddProduct: getAddProduct,
    postAddProduct: postAddProduct,
    getProducts: getProducts
}