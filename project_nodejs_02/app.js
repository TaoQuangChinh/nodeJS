const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes.handle);

server.listen(8000);