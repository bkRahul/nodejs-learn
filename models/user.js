const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

class User {
  constructor(id, username, email, cart) {
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.username = username;
    this.email = email;
    this.cart = cart;
  }

  //save the user
  //   saveUser() {
  //     const db = getDb();
  //     let dbOp;
  //     if (this._id) {
  //       dbOp = db
  //         .collection("users")
  //         .updateOne({ _id: this._id }, { $set: this });
  //     } else {
  //       dbOp = db.collection("users").insertOne(this);
  //     }
  //     return dbOp
  //       .then((result) => {
  //         console.log(result);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }

  //   static findById(id) {
  //     const db = getDb();
  //     return (
  //       db
  //         .collection("users")
  //         //finds all the users with id
  //         .find({ _id: new mongodb.ObjectId(id) })
  //         //gets the first document
  //         .next()
  //         .then((result) => {
  //           console.log(result);
  //           return result;
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         })
  //     );
  //   }

  //   static fetchAllProduct() {
  //     const db = getDb();
  //     return db
  //       .collection("products")
  //       .find()
  //       .toArray()
  //       .then((result) => {
  //         console.log(result);
  //         return result;
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }

  //   static deleteProduct(id) {
  //     const db = getDb();
  //     return db
  //       .collection("products")
  //       .deleteOne({ _id: new mongodb.ObjectId(id) })
  //       .then((result) => {
  //         console.log(result);
  //         return result;
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }

  //CART
  //add product to cart
  addToCart(product) {
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
        productId: new mongodb.ObjectId(product._id),
        quantity: newQty,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  //fetch all cart products
  getCart() {
    const db = getDb();
    //get product ids from the cart
    const productsId = this.cart.items.map((item) => item.productId);
    console.log("productsId=>>", productsId);
    //returns a cursor which has products
    return db
      .collection("products")
      .find({ _id: { $in: productsId } })
      .toArray()
      .then((products) => {
        //map each of the products and find the quantity of each product
        console.log("products=>>>", products);
        return products.map((item) => {
          return {
            ...item,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === item._id.toString();
            }).quantity,
          };
        });
      });
  }

  //delete cart product
  deleteFromCart(id) {
    const updatedCart = this.cart.items.filter(
      (item) => item.productId.toString() !== id
    );

    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: { items: updatedCart } } });
  }

  checkout() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            username: this.username,
            email: this.email,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
      });
  }

  getOrders() {
    // const db = getDb();
    // return db
    //   .collection("orders")
    //   .find()
    //   .toArray()
    //   .then((result) => {
    //     console.log("result=>>>", result);
    //     const productsId = result.map(
    //       (item) => new mongodb.ObjectId(item.items.productId)
    //     );
    //     console.log("productsId=>>>", productsId);
    // return db
    //   .collection("products")
    //   .find({ _id: { $in: productsId } })
    //   .toArray()
    //   .then((prod) => {
    //     console.log("prod=>>>", prod);
    //         console.log("products=>>>", result);
    //         return result;
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongodb.ObjectId(this._id) })
      .toArray();
  }
}

module.exports = User;
