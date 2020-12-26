const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  path: '/socket', // needed for cors in dev
});

const port = process.env.PORT || 4000;
const api = require('./api');
const twitter = require('./api/twitter');

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
/** needs to accept:
 * localhost:3000
 * frontend MEDIATED by ngrok (right now http://de98d2531c38.eu.ngrok.io)
 */

app.use(cookieParser('super duper secret password'));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(__dirname + '/public')); // static middleware

app.use('/api', api);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('register', (id) => {
    console.log('register', id);
    twitter.registerNewSocket(socket, id);
  });

  socket.on('attach', (streamId) => {
    console.log(`Socket ${socket.id} will be attached to stream ${streamId}`);
    twitter.attachSocket(socket, streamId);
  });

  socket.on('disconnect', () => {
    twitter.detachSocket(socket);
  });
});

http.listen(port, () => {
  console.log(`Express started in ${app.get('env')} mode at http://localhost:${port}`);
});
