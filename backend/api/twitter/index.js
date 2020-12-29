const { nanoid } = require('nanoid');
const Twitter = require('twitter-lite');
const credentials = require('./.credentials.json');
const fs = require('fs');
const path = require('path');

let streams = {};

const exportJSON = (data) => {
  json = { data: [] };
  data.forEach((value) => {
    json.data.push(value);
  });
  var json = JSON.stringify(json.data);
  return json;
};

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
  const twConstraints = {
    'user.id_str': constraints.follow || 'ANY',
    'entities.hashtags': constraints.track || 'ANY',
  };

  console.log(twConstraints);

  for (const [key, value] of Object.entries(twConstraints)) {
    var nesting = key.split('.');
    var tweetvalue = tweet;
    nesting.forEach((item) => {
      try {
        tweetvalue = tweetvalue[item];
      } catch (e) {
        return false;
      }
    });
    if (value === 'ANY') {
      //any value
      if (!tweetvalue) return false; //check if the value is defined in the tweet
    } else {
      //insert specifics value check here e.g if key == "place.bounding_box.coordinates" checkpointinrect(value, tweetvalue)
      if (key === 'entities.hashtags') {
        console.log(tweetvalue);
        // if there is no value return false
        if (!tweetvalue) return false;
        // if it's only one item convert to array
        else if (!Array.isArray(tweetvalue)) tweetvalue = [tweetvalue];
        // check if any of the expected hashtags are included
        return tweetvalue.some((hashtag) => value.includes(hashtag.text));
      } else {
        return value.includes(tweetvalue);
      }
    }
  }
  return true;
}

const startStream = (constraints, parameters) => {
  const streamId = nanoid(8);
  const stream = client.stream('statuses/filter', parameters);
  streams[streamId] = { stream, settings: { ...constraints, ...parameters }, data: [] };
  console.log(streams[streamId].settings);
  stream.on('start', () => console.log('stream started'));
  stream.on('error', (error) => {
    if (streams[streamId].socket) {
      streams[streamId].socket.emit('error', error);
    }

    console.log(error);
  });
  stream.on('data', (tweet) => {
    if (check(tweet, constraints)) {
      console.log(`Inside stream:data: ${tweet.text}`);
      streams[streamId].data.push(tweet);

      if (streams[streamId].socket) {
        streams[streamId].socket.emit('tweet', tweet);
      }
    }
  });
  return streamId;
};

const closeStream = (streamId) => {
  const { stream, data } = streams[streamId];
  // console.log('closeStream data:', data);
  stream.destroy();
  delete streams[streamId];
  const dataJson = exportJSON(data);
  return { dataJson };
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

// FIRST ONE: aks for token
const requestToken = async () => {
  const client = new Twitter({
    consumer_key: credentials.consumer_key, // from Twitter.
    consumer_secret: credentials.consumer_secret, // from Twitter.
  });

  const res = await client.getRequestToken('http://39fcba161c28.eu.ngrok.io/auth');
  return { token: res.oauth_token, secret: res.oauth_token_secret };
};

const requestAccess = async (oauthToken, oauthVerifier) => {
  const client = new Twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
  });

  const res = await client.getAccessToken({
    oauth_verifier: oauthVerifier,
    oauth_token: oauthToken,
  });

  return {
    accessToken: res.oauth_token,
    accessTokenSecret: res.oauth_token_secret,
    userId: res.user_id,
    screenName: res.screen_name,
  };
};

/**
 * authProps = {
    accessToken: res.oauth_token,
    accessTokenSecret: res.oauth_token_secret,
    userId: res.user_id,
    screenName: res.screen_name,
  }

  msg = {
    text : String
    media = [String]
    data:[<mediatype>][;base64],<data>
  }
 */
const sendTweet = async (msg, authProps) => {
  const client = new Twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: authProps.accessToken,
    access_token_secret: authProps.accessTokenSecret,
  });

  const uploadClient = new Twitter({
    subdomain: 'upload',
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: authProps.accessToken,
    access_token_secret: authProps.accessTokenSecret,
  });

  const mediaUploadResponses = await Promise.all(
    msg.media.map((media) =>
      uploadClient.post('media/upload', {
        media_data: media,
      })
    )
  );

  const tweet = await client.post('statuses/update', {
    status: msg.text,
    auto_populate_reply_metadata: true,
    media_ids: mediaUploadResponses.map((res) => res.media_id_string).join(','),
  });

  return tweet;
};

const attachSocket = (socket, streamId) => {
  streams[streamId].socket = socket;
  const oldData = [...streams[streamId].data];
  oldData.forEach((tweet) => {
    console.log(`In attachSocket: ${tweet.text}`);
    socket.emit('tweet', tweet);
  });
};

const detachSocket = (socket) => {
  const targetStream = Object.entries(streams).find(
    ([_, stream]) => stream.socket.id === socket.id
  );

  if (targetStream) {
    targetStream.socket = null;
  }
};

const getSettings = async (streamId) => {
  console.log('settings', streams[streamId].settings.oldFollow);
  if (!streams[streamId].settings.oldFollow) {
    streams[streamId].settings.oldFollow = streams[streamId].settings.follow;
  }
  const ids = streams[streamId].settings.oldFollow.join();
  const users = await appClient.get('users/lookup', {
    user_id: ids,
  });
  const usernames = users.map((user) => user.screen_name);
  streams[streamId].settings.follow = usernames.join();
  return streams[streamId].settings;
};

module.exports = {
  requestToken,
  requestAccess,
  startStream,
  closeStream,
  getIDs,
  sendTweet,
  attachSocket,
  detachSocket,
  getSettings,
};
