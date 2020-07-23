const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:id", shopController.getSingleProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/delete-cart-item", shopController.deleteCartItem);

router.post("/checkout", shopController.postCheckout);

router.get("/orders", shopController.getOrders);

module.exports = router;
