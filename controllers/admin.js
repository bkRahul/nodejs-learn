const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  //accepts data as object which is passed to the template
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
  //  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
};

const postAddProduct = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
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
    .catch((err) => console.log(err));
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
  Product.findById(prodId).then((product) => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }
    product.title = req.body.title;
    product.imageUrl = req.body.imageUrl;
    product.description = req.body.description;
    product.price = req.body.price;
    return product.save().then(() => res.redirect("/admin/products"));
  }).catch((err) => console.log(err));
};

//delete product
const deleteProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.deleteOne({ _id: prodId, userId: req.user.id }).then(() =>
    res.redirect("/admin/products")
  );
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
