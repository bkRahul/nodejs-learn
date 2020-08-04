const Product = require("../models/product");
const { ObjectID } = require("mongodb");
const { validationResult } = require("express-validator/check");
const { deleteFile } = require("../utils/directory");

const getAddProduct = (req, res, next) => {
  //accepts data as object which is passed to the template
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    oldInput: {},
  });
  //  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
};

const postAddProduct = (req, res, next) => {
  if (!req.file) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: "Attached file is not a image",
      oldInput: {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
      },
    });
  }

  const imagePath = req.file.path;
  const product = new Product({
    //_id: ObjectID("5f1d7b60730df23f6872e79e"),
    title: req.body.title,
    imageUrl: imagePath,
    description: req.body.description,
    price: req.body.price,
    userId: req.user._id,
  });

  product
    .save()
    .then((result) => {
      console.log("Product Created=>>", result);
      res.redirect("/");
    })
    .catch((err) => {
      //error handling
      const error = new Error(err);
      error.httpStatusCode = 500;
      //pass the error to middleware
      return next(error);
    });
};

//edit product
const getEditProduct = (req, res, next) => {
  const prodId = req.params.id;
  const editMode = req.query.edit === "true" ? true : false;

  Product.findById(prodId).then((product) => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      productData: product,
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const prodId = req.body.id;
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = req.body.title;
      product.description = req.body.description;
      product.price = req.body.price;
      if (req.file) {
        deleteFile(product.imageUrl);
        product.imageUrl = req.file.path;
      }
      return product.save().then(() => res.redirect("/admin/products"));
    })
    .catch((err) => console.log(err));
};

//delete product
const deleteProduct = (req, res, next) => {
  const prodId = req.params.id;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("product not found"));
      }
      deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user.id });
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

const getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    //query required data
    // .select('title price - _id')
    //populate related fields
    // .populate('userId')
    .then((products) => {
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
