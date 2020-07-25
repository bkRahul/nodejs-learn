const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  //accepts data as object which is passed to the template
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const postAddProduct = (req, res, next) => {
  console.log("req.user===>", req.user);
  const product = new Product(
    null,
    req.user._id,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  product.saveProduct().then(() => res.redirect("/"));
};

const getEditProduct = (req, res, next) => {
  const id = req.params.id;
  const editMode = req.query.edit === "true" ? true : false;

  Product.findById(id).then((product) => {
    res.render("admin/edit-product", {
      productData: product,
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const product = new Product(
    req.body.id,
    req.user._id,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  product.saveProduct().then(() => {
    res.redirect("/admin/products");
  });
};

const deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.deleteProduct(id).then(() => res.redirect("/admin/products"));
};

const getProducts = (req, res, next) => {
  Product.fetchAllProduct().then((products) => {
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
  getEditProduct: getEditProduct,
  postEditProduct: postEditProduct,
  deleteProduct: deleteProduct,
  getProducts: getProducts,
};
