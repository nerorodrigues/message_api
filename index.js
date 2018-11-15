const { createServer } = require('http');

httpServer = createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain'});
    response.end('Hi There!');
});

var port = process.env.PORT || 8001;

httpServer.listen(port);

console.log("Server running at http://localhost:%d", port);