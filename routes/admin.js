const express = require("express");
const router = express.Router();

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

router.get("/product", (req, res, next) => {
  res.send(
    "<body><form action='/add-product' method='POST'><input type='text' name='message'><button type='submit'>Submit</button></form></body>"
  );
});

module.exports = router;
