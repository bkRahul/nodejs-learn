var models = require("../models");
var Product = models.product;

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
  //createProduct association method provided by sequelize based on relation
  req.user
    .createProduct({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      price: req.body.price,
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEditProduct = (req, res, next) => {
  const id = req.params.id;
  const editMode = req.query.edit === "true" ? true : false;
  if (!editMode) {
    res.redirect("/");
  }
  req.user
    .getProducts({
      where: {
        id: id,
      },
    })
    .then((product) => {
      res.render("admin/edit-product", {
        productData: product[0],
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const editedProduct = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    price: req.body.price,
  };
  Product.update(editedProduct, {
    where: {
      id: id,
    },
  })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        productData: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
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
