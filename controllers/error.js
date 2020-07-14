const get404 = (req, res, next) => {
  //uses defined template engine and renders given template
  res.status(404).render("404", { pageTitle: "404 Page" });
};

module.exports.get404 = get404;