const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require('../middleware/auth')

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:id", isAuth, adminController.getEditProduct);

router.post("/edit-product/", isAuth, adminController.postEditProduct);

router.post("/delete-product/:id", isAuth, adminController.deleteProduct);

router.get("/products", isAuth, adminController.getProducts);

module.exports.routes = router;
