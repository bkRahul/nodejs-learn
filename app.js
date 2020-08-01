const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

const MONGODB_URI =
  "mongodb+srv://rahul:root@nodejs-learn.ffvda.mongodb.net/shop?retryWrites=true&w=majority";

//store session in mongodb
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

//set csrf token
const csrfProtection = csrf();

//template engine
app.set("view engine", "pug");
//templates directory
app.set("views", "views");

//parse the incoming form data to be available in req.body
app.use(bodyParser.urlencoded({ extended: false }));

//serve static files
app.use(express.static(path.join(__dirname, "public")));

//set session middleware
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//csrf middleware
app.use(csrfProtection);

//use flash
app.use(flash());

app.use((req, res, next) => {
  //get user info from req session
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
    })
    .then(() => {
      const css =
        "background: #bada55; color: #000; font-weight: bolder; font-size: 16px;";
      console.log("%creq.user=>>>", css);
      console.log("req=>>>", req);
      next();
    })
    .catch((err) => console.log("Error occoured while fetching user", err));
});

//add a locals middleware to access auth and csrf token
app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//group routes across files based on the business logic or url
app.use("/admin", adminRoutes.routes);
app.use("/auth", authRoutes.routes);
app.use(shopRoutes);

//a 404 page for non matching routes
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Rahul",
    //       email: "rahul@rahul.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });
    app.listen(3001, () => {
      console.log("server is running");
    });
  })
  .catch((err) => console.log(err));
