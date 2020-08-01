const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const User = require("../models/user");

//fake smtp testing
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "32df2bac8faa2e",
    pass: "f41d4e1a461c7a",
  },
});

//get login
const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "login",
    path: "/auth/login",
    errorMessage: req.flash("error"),
  });
};

//post login
const postLogin = (req, res, next) => {
  //store user data in req object session
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid Email or Password");
        return res.redirect("/auth/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid Password");
          res.redirect("/auth/login");
        })
        .catch((err) => {
          console.log("Error occoured while matching password", err);
          res.redirect("/auth/login");
        });
    })
    .catch((err) => {
      console.log("Error occoured while fetching password", err);
    });
};

//get signup
const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    path: "/auth/signup",
    errorMessage: req.flash("error"),
  });
};

//post signup
const postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPwd = req.body.confirmPwd;

  if (password !== confirmPwd) {
    req.flash("error", "passwords do not match");
    return res.redirect("/auth/signup");
  }
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email exists");
        return res.redirect("/auth/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPwd) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPwd,
            cart: {
              items: [],
            },
          });
          return user.save();
        })
        .then(() => {
          res.redirect("/auth/login");
          return transport
            .sendMail({
              to: email,
              from: "learnnodejs@gmail.com",
              subject: "Sign Up Welcome Mail",
              html: "<h1>Welcome To Learn Node JS</h1>",
            })
            .then(() => console.log("Email sent"));
        })
        .catch((err) =>
          console.log("Error occoured while saving new user", err)
        );
    })
    .catch((err) => console.log("Error occured while fetching user", err));
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

//reset password
const getResetPassword = (req, res, next) => {
  res.render("auth/resetPwd", {
    pageTitle: "Reset Password",
    path: "/auth/reset-password",
    errorMessage: req.flash("error"),
  });
};

const postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/auth/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email has been not registered. Please Sign up");
          return res.redirect("/auth/reset-password");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((user) => {
        return transport
          .sendMail({
            to: req.body.email,
            from: "learnnodejs@gmail.com",
            subject: "Reset Password",
            html: `<h1>Hi</h1><br/>
        If you have lost your password or wish to reset it <br/>
        click <a href='http://localhost:3001/auth/new-password/${token}'>here</a> or paste the following link into your browser<br/>
        Note that the link will expire in ${new Date(
          user.resetTokenExpiration
        ).toString()}.
        `,
          })
          .then(() => console.log("Email sent"));
      })
      .catch((err) => console.log(err));
  });
};

//New password
const getNewPassword = (req, res, next) => {
  User.findOne({
    resetToken: req.params.token,
    resetTokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    res.render("auth/newPwd", {
      pageTitle: "New Password",
      path: "/auth/new-password",
      errorMessage: req.flash("error"),
      resetToken: req.params.token,
      userId: user._id.toString(),
    });
  });
};

const postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const resetToken = req.body.resetToken;
  const password = req.body.password;
  const confirmPwd = req.body.confirmPwd;
  console.log("userId=>>>", userId)
  console.log("resetToken=>>>", resetToken)
  console.log("password=>>>", password)
  console.log("confirmPwd=>>>", confirmPwd)
  let resetUser;
  if (password !== confirmPwd) {
    req.flash("error", "passwords do not match");
    return res.redirect(`/auth/new-password/${resetToken}`);
  }

  User.findOne({
    resetToken: resetToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      console.log("user=>>>", user)
      resetUser = user;
      return bcrypt.hash(confirmPwd, 12);
    })
    .then((hashedPwd) => {
      console.log("hashedPwd=>>>", hashedPwd)
      console.log("resetUser=>>>", resetUser)
      console.log("resetUser.password=>>>", resetUser.password)
      
      resetUser.password = hashedPwd;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => res.redirect("/auth/login"))
    .catch((err) => console.log(err));
};

module.exports = {
  getLogin: getLogin,
  postLogin: postLogin,
  postLogout: postLogout,
  getSignup: getSignup,
  postSignup: postSignup,
  getResetPassword: getResetPassword,
  postResetPassword: postResetPassword,
  getNewPassword: getNewPassword,
  postNewPassword: postNewPassword,
};
