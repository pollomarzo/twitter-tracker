const { nanoid } = require('nanoid');
const Twitter = require('twitter-lite');
const credentials = require('./.credentials');
const util = require('util');

let streams = {};

function exportJSON(data) {
  json = { data: [] };
  data.forEach((value) => {
    json.data.push(value);
  });
  var json = JSON.stringify(json.data);
  return json;
}

const client = new Twitter({
  subdomain: 'api',
  version: '1.1',
  consumer_key: credentials.consumer_key, // from Twitter.
  consumer_secret: credentials.consumer_secret, // from Twitter.
  access_token_key: credentials.access_token_key, // from your User (oauth_token)
  access_token_secret: credentials.access_token_secret, // from your User (oauth_token_secret);
});

const startStream = (type, parameters) => {
  const streamId = nanoid(8);
  const stream = client.stream('statuses/filter', parameters);
  streams[streamId] = { stream, data: [], error: null };
  stream.on('start', () => console.log('stream started'));
  stream.on('error', (error) => {
    console.log(`ERROR! Twitter says: ${util.inspect(error)}`);
    streams[streamId].error = error;
  }); //todo handler error
  stream.on('data', (tweet) => {s
    switch (type) {
      case 'hashtag':
        if (tweet.user.location || tweet.geo || tweet.coordinates || tweet.place) {
          streams[streamId].data.push(tweet);
          console.log('SHOOTING TWEET');
          streams[streamId].socket.emit('tweet', tweet);
        }
        break;
      default:
        streams[streamId].data.push(tweet);
        console.log('SHOOTING TWEET');
        streams[streamId].socket.emit('tweet', tweet);
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
  streams[streamId].socket = socket;
};

register.startStream = startStream;
register.closeStream = closeStream;

module.exports = register;
