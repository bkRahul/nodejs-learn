//exporting the db object
var models = require("../models");
const order = require("../models/order");
//contains the model keyed by its name
var Product = models.product;

const getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        productData: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

//get all products
const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/products", {
        productData: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

//get single product details
const getSingleProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findAll({
    where: {
      id: id,
    },
  })
    .then((product) => {
      res.render("shop/product-detail", {
        productData: product[0],
        pageTitle: product[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

//get cart products
const getCart = (req, res, next) => {
  req.user.getCart().then((cart) => {
    cart
      .getProducts()
      .then((cartProducts) => {
        res.render("shop/cart", {
          cartData: cartProducts,
          pageTitle: "Cart",
          path: "/cart",
        });
      })
      .catch((err) => console.log(err));
  });
};

//add to cart
const postCart = (req, res, next) => {
  const productId = req.body.id;
  let fetchedCart;
  let newQty = 1;
  //get the userid from cart table data for a logged user
  req.user.getCart().then((cart) => {
    fetchedCart = cart;
    //get product from products table using productId
    return cart
      .getProducts({
        where: {
          id: productId,
        },
      })
      .then((cartProducts) => {
        let product;
        //set first item of array to product
        if (cartProducts.length > 0) {
          product = cartProducts[0];
        }
        //if product is present increase quantity
        if (product) {
          const oldQty = product.cartItem.quantity;
          newQty = oldQty + 1;
          return product;
        }
        //if product is not present return product by product id
        return Product.findByPk(productId);
      })
      .then((product) => {
        //add the product to cart through quantity relation
        return fetchedCart.addProduct(product, {
          through: { quantity: newQty },
        });
      })
      .then(() => res.redirect("/cart"))
      .catch((err) => console.log(err));
  });
};

//delete from cart
const deleteCartItem = (req, res, next) => {
  const productId = req.body.id;
  //get the userid from cart table data for a logged user
  req.user.getCart().then((cart) => {
    //get cart product for req id using getProducts() associate method which cart model provides
    return cart
      .getProducts({ where: { id: productId } })
      .then((product) => {
        const cartProduct = product[0];
        //delete the product from the cartitem table
        return cartProduct.cartItem.destroy();
      })
      .then(() => res.redirect("/cart"))
      .catch((err) => console.log(err));
  });
};

//checkout
const postCheckout = (req, res, next) => {
  let fetchedCart;
  //get the userid from cart table data for a logged user
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      //get cart products for req id using getProducts() associate method which cart model provides
      return cart.getProducts();
    })
    .then((products) => {
      //create a order for the user
      return req.user
        .createOrder()
        //associate the products with the given order
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              //assign a new property orderItem having the quantity of each product
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .then(()=> fetchedCart.setProducts(null))
        .then(() => res.redirect("/cart"));
    })
    .catch((err) => console.log(err));
};

//get all products
const getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then((orders) => {
    const css ='background: #bada55; color: #000; font-size: 18px;';
    console.log("%crorders=>>>", css);
    console.log("orders=>>>", orders);
    res.render("shop/orders", {
      orderData: orders,
      pageTitle: "Your Orders",
      path: "/orders",
    });
})
  .catch((err) => console.log(err));
};

module.exports = {
  getIndex: getIndex,
  getProducts: getProducts,
  getSingleProduct: getSingleProduct,
  getCart: getCart,
  postCart: postCart,
  deleteCartItem: deleteCartItem,
  postCheckout: postCheckout,
  getOrders: getOrders
};
