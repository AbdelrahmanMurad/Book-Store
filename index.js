const http = require('http')
const app = require('./app')

const server = http.createServer(app);

server.listen(process.env.PORT, () => console.log('Port is listening => http://localhost:5000.'))
//http://localhost:5000