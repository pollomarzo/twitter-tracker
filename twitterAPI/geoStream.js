const Twitter = require("twitter-lite");
const credentials = require("./credentials.json");

const client = new Twitter({
  subdomain: "api", // "api" is the default (change for other subdomains)
  version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: credentials.consumer_key, // from Twitter.
  consumer_secret: credentials.consumer_secret, // from Twitter.
  access_token_key: credentials.access_token_key, // from your User (oauth_token)
  access_token_secret: credentials.access_token_secret, // from your User (oauth_token_secret)
});

// client
//   .get("account/verify_credentials")
//   .then((results) => console.log("CREDENTIALS OK"))
//   .catch((error) => console.log(error)); //todo: handle error

var data = [];
var stream = {};

function exportJSON(data) {
  json = { data: [] };
  data.forEach((value, index) => {
    json.data.push(value);
  });
  var json = JSON.stringify(json);
  return json;
}

process.on("message", function (coordinates) {
  console.log("coordinates received");
  stream = client
    .stream("statuses/filter", { locations: coordinates })
    .on("error", (error) => console.log(error)) //todo handler error
    .on("start", (response) => console.log("stream started"))
    .on("data", (tweet) => {
      console.log(tweet.text);
      data.push(tweet);
    })
    .on("end", (response) => {
      process.send(exportJSON(data));
      process.exit(0);
    });
});

process.on("SIGINT", () => {
  console.log("got kill");
  process.nextTick(() => {
    stream.emit("end");
    stream.removeAllListeners();
  });
});
