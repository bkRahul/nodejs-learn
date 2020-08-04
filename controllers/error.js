exports.get404 = (req, res, next) => {
  //uses defined template engine and renders given template
  res.status(404).render("404", { pageTitle: "404 Page" });
};

exports.get500 = (req, res, next) => {
  //uses defined template engine and renders given template
  res.status(500).render("500", { pageTitle: "500 Page" });
};