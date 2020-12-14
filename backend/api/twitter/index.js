const { nanoid } = require('nanoid');
const Twitter = require('twitter-lite');
const credentials = require('./.credentials');

let streams = {};

const exportJSON = data => {
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

// use this whenever possible for higher rates
const appClient = new Twitter({
  bearer_token: credentials.bearer_token,
});

function check(tweet, constraints) {
  for (const [key, value] of Object.entries(constraints)) {
    var nesting = key.split('.');
    var tweetvalue = tweet;
    nesting.forEach(item => {
      try {
        tweetvalue = tweetvalue[item];
      } catch (e) {
        return false;
      }
    });
    if (value.toUpperCase() === 'ANY') {
      //any value
      if (!tweetvalue) return false; //check if the value is defined in the tweet
    } else {
      //insert specifics value check here e.g if key == "place.bounding_box.coordinates" checkpointinrect(value, tweetvalue)
      if (key === 'entities.hashtags') {
        // if there is no value return false
        if (!tweetvalue) return false;
        // if it's only one item convert to array
        else if (!Array.isArray(tweetvalue)) tweetvalue = [tweetvalue];
        // check if any of the expected hashtags are included
        return tweetvalue.some((hashtag) => value.includes(hashtag));
      }
      return tweetvalue === value;
    }
  }
  return true;
}

const startStream = (constraints, parameters) => {
  const streamId = nanoid(8);
  const stream = client.stream('statuses/filter', parameters);
  streams[streamId] = { stream, data: [] };
  stream.on('start', () => console.log('stream started'));
  stream.on('error', (error) => {
    streams[streamId].socket.emit('error', error);
    console.log(error);
  }); //todo handler error
  stream.on('data', (tweet) => {
    if (check(tweet, constraints)) {
      console.log(tweet.text);
      streams[streamId].data.push(tweet);
      streams[streamId].socket.emit('tweet', tweet);
    }
  });
  return streamId;
};

const closeStream = (streamId) => {
  const { stream, data } = streams[streamId];
  console.log('closeStream data:', data);
  stream.destroy();
  delete streams[streamId];
  const dataJson = exportJSON(data);
  return { dataJson };
};

const register = (socket, streamId) => {
  streams[streamId].socket = socket;
};

//returns an Array of IDs
const getIDs = async (usernames) => {
  //we assume usernames is a CSV
  console.log('asking twitter for', usernames);
  const users = await appClient.get('users/lookup', {
    screen_name: usernames.replace(' ', ''),
  });
  return users.map((user) => user.id_str);
};

register.startStream = startStream;
register.closeStream = closeStream;
register.getIDs = getIDs;

module.exports = register;
