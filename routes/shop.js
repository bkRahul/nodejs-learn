const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:id", shopController.getSingleProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/delete-cart-item", isAuth, shopController.deleteCartItem);

router.post("/checkout", isAuth, shopController.checkout);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/invoice/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
