const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("please enter a valid email").normalizeEmail(),
    body(
      "password",
      "Please enter password min length 5 and only numbers and alphabets"
    )
      .isLength({ min: 5 })
      .isAlphanumeric().trim(),
    body("confirmPwd").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("passwords do not match");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/new-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports.routes = router;
