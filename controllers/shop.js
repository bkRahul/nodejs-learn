const path = require("path");
const fs = require("fs");

const Product = require("../models/product");
const Order = require("../models/order");
const { createInvoice } = require("../utils/invoiceTemplate");

const ITEMS_PER_PAGE = 2;

const getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;
  Product.find()
    .countDocuments()
    .then((prodNum) => {
      totalItems = prodNum;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })

    .then((products) => {
      res.render("shop/index", {
        productData: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE) 
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProducts = (req, res, next) => {
  Product.find().then((products) => {
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
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      console.log("cartProducts=>>>", user.cart.items);
      res.render("shop/cart", {
        cartData: user.cart.items,
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
  req.user
    .deleteFromCart(req.body.id)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

//checkout
const checkout = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          product: { ...item.productId._doc },
          quantity: item.quantity,
        };
      });
      const order = new Order({
        products: products,
        user: {
          name: req.user.name,
          email: req.user.email,
          userId: req.user,
        },
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    console.log("orders=>>>", orders);
    res.render("shop/orders", {
      orderData: orders,
      pageTitle: "Orders",
      path: "/orders",
    });
  });
};

const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("Order not found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Not Authorized"));
      }
      createInvoice(req, res, order);
      //send the file by readFIle
      // fs.readFile(invoiceFilePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline; filename="' + invoiceFile + '"'
      //   );
      //   res.send(data);
      // });

      //stream the data for bigger files
      // const file = fs.createReadStream(invoiceFilePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'inline; filename="' + invoiceFile + '"'
      // );
      // file.pipe(res);
    })
    .catch((err) => next(err));
};

module.exports = {
  getIndex: getIndex,
  getProducts: getProducts,
  getSingleProduct: getSingleProduct,
  getCart: getCart,
  postCart: postCart,
  deleteCartItem: deleteCartItem,
  checkout: checkout,
  getOrders: getOrders,
  getInvoice: getInvoice,
};
