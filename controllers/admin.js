const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  //accepts data as object which is passed to the template
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuth: req.session.isLoggedIn
  });
  //  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
};

const postAddProduct = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    price: req.body.price,
    userId: req.user._id
  });
  product
    .save()
    .then((result) => {
      console.log("Product Created=>>", result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
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
      isAuth: req.session.isLoggedIn
    });
  });
};

const postEditProduct = (req, res, next) => {
  Product.findById(req.body.id)
    .then((product) => {
      product.title = req.body.title;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      product.price = req.body.price;
      return product.save();
    })
    .then(() => res.redirect("/admin/products"));
};

const deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findByIdAndRemove(id).then(() => res.redirect("/admin/products"));
};

const getProducts = (req, res, next) => {
  Product.find()
  //query required data
  // .select('title price - _id')
  //populate related fields
  // .populate('userId')
  .then((products) => {
    res.render("admin/products", {
      productData: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      isAuth: req.session.isLoggedIn
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
