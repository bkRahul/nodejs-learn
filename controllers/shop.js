const Product = require("../models/product");
const Cart = require("../models/cart");

const getIndex = (req, res, next) => {
  Product.fetchAllProduct().then((products) => {
    res.render("shop/index", {
      productData: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

const getProducts = (req, res, next) => {
  Product.fetchAllProduct().then((products) => {
    res.render("shop/products", {
      productData: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

const getSingleProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id).then((product) => {
    res.render("shop/product-detail", {
      productData: product,
      pageTitle: "Single Products",
      path: "/products",
    });
  });
};

//get cart items
const getCart = (req, res, next) => {
  req.user.getCart().then((cartProducts) => {
    console.log("cartProducts=>>>", cartProducts);
    res.render("shop/cart", {
      cartData: cartProducts,
      pageTitle: "Cart",
      path: "/cart",
    });
  });
};

//add item to cart
const postCart = (req, res, next) => {
  Product.findById(req.body.id)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("postCart=>>>", result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

//delete item from cart
const deleteCartItem = (req, res, next) => {
  req.user.deleteFromCart(req.body.id)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

const checkout = (req, res, next) => {
  req.user.checkout()
  .then((result) => {
    res.redirect("/cart");
  })
  .catch((err) => {
    console.log(err);
  });
};

const getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    console.log("orders=>>>", orders);
    res.render("shop/orders", {
      orderData: orders,
      pageTitle: "Orders",
      path: "/orders",
    });
  });
}

module.exports = {
  getIndex: getIndex,
  getProducts: getProducts,
  getSingleProduct: getSingleProduct,
  getCart: getCart,
  postCart: postCart,
  deleteCartItem: deleteCartItem,
  checkout: checkout,
  getOrders: getOrders
};
