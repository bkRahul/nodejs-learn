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
  const product = new Product(
    null,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  product.saveProduct();
  res.redirect("/");
};

const getEditProduct = (req, res, next) => {
  const id = req.params.id;
  const editMode = req.query.edit === "true" ? true : false;

  Product.findById(id, (product) => {
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
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  product.saveProduct();
  res.redirect("/admin/products");
};

const deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.deleteProduct(id)
  res.redirect("/admin/products");
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
  getEditProduct: getEditProduct,
  postEditProduct: postEditProduct,
  deleteProduct: deleteProduct,
  getProducts: getProducts,
};
