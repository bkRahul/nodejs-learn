const url = require('url');
//require the url module

const address = "https://bkrahul.github.io/mobiotics-test/data/data.json?year=2019&month=May";

const parsedUrl = url.parse(address, false)
//If true query will be set to an object
//If false, query on the returned URL object will be an unparsed, undecoded string

console.log(parsedUrl.host);
//return the hostname

console.log(parsedUrl.path);
//return the path

console.log(parsedUrl.query);
//return the query parameters as object

console.log(parsedUrl.query.year);
//return the year query value
