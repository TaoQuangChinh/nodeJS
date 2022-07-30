const http = require('http');
const routes = require('./routes');

console.log(routes.logs);
const server = http.createServer(routes.handle);

server.listen(300);