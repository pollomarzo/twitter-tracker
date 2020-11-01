const { v4: uuidv4 } = require("uuid/v4");
const Twitter = require("twitter-lite");

let streams = {};

const client = new Twitter({
  subdomain: "api",
  version: "1.1",
  consumer_key: credentials.consumer_key, // from Twitter.
  consumer_secret: credentials.consumer_secret, // from Twitter.
  access_token_key: credentials.access_token_key, // from your User (oauth_token)
  access_token_secret: credentials.access_token_secret, // from your User (oauth_token_secret);
});

exports.startStream = (locations) => {
  const streamId = uuidv4();
  const stream = client.stream("statuses/filter", { locations });
  stream.on("start", () => {
    streams[streamId] = { stream, data: [], error: null };
  });
  stream.on("error", (error) => (streams[streamId].error = error)); //todo handler error
  stream.on("data", (tweet) => {
    streams[streamId].data.push(tweet);
  });
  stream.on("end", () => delete streams[streamId]);
};

exports.closeStream = (streamId) => {
  const { stream, data, error } = streams[streamId];
  stream.emit("end");
  return { data, error };
};
