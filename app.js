const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const app = express();

//template engine
app.set("view engine", "pug");
//templates directory
app.set("views", "views");

//parse the incoming form data to be available in req.body
app.use(bodyParser.urlencoded({ extended: false }));

//serve static files
app.use(express.static(path.join(__dirname, "public")));

//import models
const models = require("./models");

app.use((req, res, next) => {
  return models.user
    .findByPk(1)
    .then((user) => {
      req.user = user;
    })
    .then((user) => {
      const css ='background: #bada55; color: #000; font-size: 18px;';
      console.log("%creq.user=>>>", css);
      console.log("req.user=>>>", req.user);
      next();
    })
    .catch((err) => {
      console.log("Error occoured while creating Models", err);
    });
});

//group routes across files based on the business logic or url
app.use("/admin", adminRoutes.routes);

app.use(shopRoutes);

//a 404 page for non matching routes
app.use(errorController.get404);

//associate model relations
models.product.belongsTo(models.user, {
  contraints: true,
  onDelete: "CASCADE",
});
models.user.hasMany(models.product);
models.user.hasOne(models.cart);
models.cart.belongsTo(models.user);
models.cart.belongsToMany(models.product, { through: models.cartItem });
models.product.belongsToMany(models.cart, { through: models.cartItem });
models.order.belongsTo(models.user);
models.user.hasMany(models.order);
models.order.belongsToMany(models.product, { through: models.orderItem });

//sync models to database by creating appropriate tables
models.sequelize
  .sync()
  // .sync({force: true})
  .then(() => {
    console.log("Models created successfully");
    return models.user.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return models.user.create({ name: "Rahul", email: "max@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then(() => {
    app.listen(3001, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("Error occoured while creating Models", err);
  });
