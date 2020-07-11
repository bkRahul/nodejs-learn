const path = require("path");
const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Submit</button></form></body>"
    );
    res.write("</html>");
    res.end();
  } else if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log("chunk=>>", chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        if (err) {
          throw err;
        }
        console.log("File has been written");
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  } else {
    fs.readFile(path.join(__dirname, "home.html"), (err, data) => {
      if (err) {
        throw err;
      }
      res.writeHead(200, { "content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  }
};

module.exports.requestHandler = requestHandler;
