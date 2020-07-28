const User = require("../models/user");

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "login",
    path: "/auth/login",
  });
};

const postLogin = (req, res, next) => {
  User.findOne()
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log("Error occoured while fetching user", err);
    });
};

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    path: "/auth/signup",
  });
};

const postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPwd = req.body.confirmPwd;
  if (password !== confirmPwd) {
    console.log("passwors do not match");
  }
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        console.log("Email exists");
      } else {
        const user = new User({
          name: name,
          email: email,
          password: password,
          cart: {
            items: [],
          },
        });
        user.save();
      }
    })
    .then(() => res.redirect("/auth/login"))
    .catch((err) => {
      console.log("Error occoured while fetching user", err);
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("Error occoured while logout", err);
    res.redirect("/");
  });
};

module.exports = {
  getLogin: getLogin,
  postLogin: postLogin,
  postLogout: postLogout,
  getSignup: getSignup,
  postSignup: postSignup,
};
