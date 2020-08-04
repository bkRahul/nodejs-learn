const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/auth");
const { check, body } = require("express-validator/check");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  isAuth,
  [
    check("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  adminController.postAddProduct
);

router.get(
  "/edit-product/:id",
  isAuth,
  [
    check("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  adminController.getEditProduct
);

router.post("/edit-product/", isAuth, adminController.postEditProduct);

router.post("/delete-product/:id", isAuth, adminController.deleteProduct);

router.get("/products", isAuth, adminController.getProducts);

module.exports = router;
