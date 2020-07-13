const express = require("express");

const productData = require('./admin')

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(productData.products);
  //accepts data as object which is passed to the template 
  res.render('shop', {productData: productData.products, pageTitle: 'Shop', path: '/'});
//  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;