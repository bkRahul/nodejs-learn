const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

//template engine
app.set('view engine', 'pug');
//templates directory
app.set('views', 'views')

//parse the incoming form data to be available in req.body
app.use(bodyParser.urlencoded({ extended: false }));

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

//group routes across files based on the business logic or url
app.use("/admin", adminData.routes);

app.use(shopRoutes);

//a 404 page for non matching routes
app.use((req, res, next) => {
  //uses defined template engine and renders given template
  res.status(404).render('404', {pageTitle: '404 Page'});
//  sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3001, () => {
  console.log("server is running");
});
