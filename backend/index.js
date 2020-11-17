const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  path: '/socket', // needed for cors in dev
});

const port = process.env.PORT || 4000;
const api = require('./api');
const registerNewSocket = require('./api/twitter');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public')); // static middleware

app.use('/api', api);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('register', (id) => {
    console.log('register', id);
    registerNewSocket(socket, id);
  });
});

http.listen(port, () => {
  console.log(`Express started in ${app.get('env')} mode at http://localhost:${port}`);
});
