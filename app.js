const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const database = require("./utils/database");
const User = require("./models/user");

const app = express();

//template engine
app.set("view engine", "pug");
//templates directory
app.set("views", "views");

//parse the incoming form data to be available in req.body
app.use(bodyParser.urlencoded({ extended: false }));

//serve static files
app.use(express.static(path.join(__dirname, "public")));

//get the user id and assign to req.user
app.use((req, res, next) => {
  //get database
  const db = database.getDb();
  //get collectioon
  const op = db.collection("users");
  //find all users
  op.find()
    .toArray()
    .then((user) => {
      if (user.length > 0) {
        //create a new user instance
        req.user = new User(
          user[0]._id,
          user[0].username,
          user[0].email,
          user[0].cart
        );
        console.log("user exists");
        console.log("req.user===>", req.user);
        next();
      } else {
        op.insertOne({
          username: "Rahul",
          email: "test@test.com",
          cart: { items: [] },
        });
        console.log("users collection is created");
        next();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//group routes across files based on the business logic or url
app.use("/admin", adminRoutes.routes);

app.use(shopRoutes);

//a 404 page for non matching routes
app.use(errorController.get404);

database.mongoConnect(() => {
  app.listen(3001, () => {
    console.log("server is running");
  });
});
