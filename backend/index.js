const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const creds = require('./api/twitter/.credentials.json');

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  path: '/socket', // needed for cors in dev
});

const port = process.env.PORT || 4000;
const api = require('./api');
const twitter = require('./api/twitter');

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', creds.auth_url.replace('/auth', '')],
  })
);
/** needs to accept:
 * localhost:3000
 * frontend MEDIATED by ngrok (right now http://de98d2531c38.eu.ngrok.io)
 */

app.use(cookieParser('super duper secret password'));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, 'build'))); // static middleware

app.use('/api', api);

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('attach', ({ streamId }) => {
    console.log(`Socket ${socket.id} will be attached to stream ${streamId}`);
    twitter.attachSocket(socket, streamId);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    twitter.detachSocket(socket);
  });
});

http.listen(port, () => {
  console.log(`Express started in ${app.get('env')} mode at http://localhost:${port}`);
});
