const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error")

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
app.use("/admin", adminRoutes.routes);

app.use(shopRoutes);

//a 404 page for non matching routes
app.use(errorController.get404);

app.listen(3001, () => {
  console.log("server is running");
});
