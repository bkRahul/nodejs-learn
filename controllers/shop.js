const Product = require("../models/product");
const Cart = require("../models/cart");

const getIndex = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/index", {
      productData: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

const getProducts = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/products", {
      productData: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

const getSingleProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id, (product) => {
    res.render("shop/product-detail", {
      productData: product,
      pageTitle: "Single Products",
      path: "/products",
    });
  });
};

const getCart = (req, res, next) => {
  let cartProducts = [];
  Cart.fetchCart((cart) => {
    Product.fetchAllProduct((products) => {
      for (const product of products) {
        const cartProduct = cart.products.find(
          (item) => item.id === product.id
        );
        if (cartProduct) {
          cartProducts.push({ productData: product, qty: cartProduct.qty });
        }
      }
      console.log("cart=>>>", cartProducts);
      res.render("shop/cart", {
        cartData: cartProducts,
        pageTitle: "Cart",
        path: "/cart",
      });
    });
  });
};

const postCart = (req, res, next) => {
  Product.findById(req.body.id, (product) => {
    Cart.addProduct(req.body.id, product.price);
  });
  res.redirect("/cart");
};

const deleteCartItem = (req, res, next) => {
  Product.findById(req.body.id, (product) => {
    Cart.deleteProduct(req.body.id, product.price);
  });
  res.redirect("/cart");
};

const getCheckout = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/checkout", {
      productData: products,
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
};

module.exports = {
  getIndex: getIndex,
  getProducts: getProducts,
  getSingleProduct: getSingleProduct,
  getCart: getCart,
  postCart: postCart,
  deleteCartItem: deleteCartItem,
  getCheckout: getCheckout,
};
