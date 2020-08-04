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
const { uploadSingle } = require("./utils/multer");

const MONGODB_URI =
  "mongodb+srv://rahul:root@nodejs-learn.ffvda.mongodb.net/shop?retryWrites=true&w=majority";

//store session in mongodb
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const app = express();

//set csrf token
const csrfProtection = csrf();

//template engine
app.set("view engine", "pug");
//templates directory
app.set("views", "views");

//parse the incoming form data to be available in req.body
app.use(bodyParser.urlencoded({ extended: false }));

//multer middleware
app.use(uploadSingle);

//serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use('/public', express.static(path.join(__dirname, "public")));

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

//add a locals middleware to access auth and csrf token
app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  //get user info from req session
  //throw new Error('some error');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
    })
    .then(() => {
      //can use throw in sync code
      //      throw new Error('some error');
      const css =
        "background: #bada55; color: #000; font-weight: bolder; font-size: 16px;";
      console.log("%creq.user=>>>", css);
      console.log("req=>>>", req);
      next();
    })
    .catch((err) => {
      //have to use next inside async code
      next(new Error("some user info fetch error==>>", err));
    });
});

//group routes across files based on the business logic or url
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes.routes);
app.use(shopRoutes);

//a 500 page for error
app.use("/500", errorController.get500);

//a 404 page for non matching routes
app.use(errorController.get404);

//error middleware
app.use((err, req, res, next) => {
  console.log("err handler=>>", err);
  res.render("500", {
    pageTitle: "500 Page",
    isAuth: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3001, () => {
      console.log("server is running");
    });
  })
  .catch((err) => console.log(err));
