const { v4: uuidv4 } = require('uuid');
const Twitter = require('twitter-lite');
const credentials = require('./.credentials');

let streams = {};

function exportJSON(data) {
  json = { data: [] };
  data.forEach((value) => {
    json.data.push(value);
  });
  var json = JSON.stringify(json.data);
  return json;
}
console.log('hello');
const client = new Twitter({
  subdomain: 'api',
  version: '1.1',
  consumer_key: credentials.consumer_key, // from Twitter.
  consumer_secret: credentials.consumer_secret, // from Twitter.
  access_token_key: credentials.access_token_key, // from your User (oauth_token)
  access_token_secret: credentials.access_token_secret, // from your User (oauth_token_secret);
});

const startStream = (type, parameters) => {
  const streamId = uuidv4();
  console.log(streamId);
  const stream = client.stream('statuses/filter', parameters);
  streams[streamId] = { stream, data: [], error: null };
  console.log(`startStream: ${register.magic}`);
  stream.on('start', () => console.log('stream started'));
  stream.on('error', (error) => {
    console.log(`ERROR! Twitter says: ${error.message}`);
    streams[streamId].error = error;
  }); //todo handler error
  stream.on('data', (tweet) => {
    switch (type) {
      case 'hashtag':
        if (tweet.user.location || tweet.geo || tweet.coordinates || tweet.place) {
          streams[streamId].data.push(tweet);
          streams[streamId].socket.emit('data', tweet);
          console.log(tweet.text);
        }
        break;
      default:
        streams[streamId].data.push(tweet);
        console.log(tweet.text);
    }
  });
  return streamId;
};

const closeStream = (streamId) => {
  const { stream, data, error } = streams[streamId];
  console.log('closeStream data:', data);
  stream.destroy();
  delete streams[streamId];
  const dataJson = exportJSON(data);
  return { dataJson, error };
};

const register = (socket, streamId) => {
  console.log(`Register: ${register.magic}`);
  streams[streamId].socket = socket;
};

register.startStream = startStream;
register.closeStream = closeStream;
register.magic = Math.random();

module.exports = register;
