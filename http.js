const http = require('http');
const path = require('path');
const fs = require('fs')

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'home.html'), (err, data) => {
            res.writeHead(200, { 'content-Type': 'text/html' });
            res.write(data);
            res.end();    
        })
    } else if (req.url === '/about') {
        res.write('hello About page');
	    res.end();
    }
})

server.listen(3001, () => {
    console.log('server is running')
})