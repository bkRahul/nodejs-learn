const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  resetToken: { type: String },
  resetTokenExpiration: { type: Number }
});

//add to cart
userSchema.methods.addToCart = function (product) {
  let newQty = 1;
  const updatedCartItems = [...this.cart.items];
  console.log("updatedCartItems=>>>", updatedCartItems);
  //find the index of the product
  const cartProductIndex = this.cart.items.findIndex((item) => {
    return item.productId.toString() === product._id.toString();
  });
  //if index found product is present
  if (cartProductIndex >= 0) {
    newQty = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQty;
  } else {
    //if index not found push the new product
    updatedCartItems.push({
      productId: product._id,
      quantity: newQty,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

//delete cart product
userSchema.methods.deleteFromCart = function (id) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== id
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
