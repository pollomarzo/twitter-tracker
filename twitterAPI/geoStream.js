const { v4: uuidv4 } = require("uuid");
const Twitter = require("twitter-lite");
const credentials = require("./.credentials");

let streams = {};

function exportJSON(data) {
  json = { data: [] };
  data.forEach((value, index) => {
    json.data.push(value);
  });
  var json = JSON.stringify(json.data);
  return json;
}

const client = new Twitter({
  subdomain: "api",
  version: "1.1",
  consumer_key: credentials.consumer_key, // from Twitter.
  consumer_secret: credentials.consumer_secret, // from Twitter.
  access_token_key: credentials.access_token_key, // from your User (oauth_token)
  access_token_secret: credentials.access_token_secret, // from your User (oauth_token_secret);
});

exports.startStream = (type, parameters) => {
  const streamId = uuidv4();
  const stream = client.stream("statuses/filter", parameters);
  stream.on("start", () => {
    streams[streamId] = { stream, data: [], error: null };
    console.log("stream started");
  });
  stream.on("error", (error) => (streams[streamId].error = error)); //todo handler error
  stream.on("data", (tweet) => {
    switch (type) {
      case "hashtag":
        if (
          tweet.user.location ||
          tweet.geo ||
          tweet.coordinates ||
          tweet.place
        ) {
          streams[streamId].data.push(tweet);
          console.log(tweet.text);
        }
        break;
      default:
        streams[streamId].data.push(tweet);
        console.log(tweet.text);
    }
  });
  stream.on("end", () => delete streams[streamId]);
  return streamId;
};

exports.closeStream = (streamId) => {
  const { stream, data, error } = streams[streamId];
  console.log("closeStream data:", data);
  stream.emit("end");
  stream.removeAllListeners();
  const dataJson = exportJSON(data);
  return { dataJson, error };
};
