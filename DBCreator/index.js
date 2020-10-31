const Twitter = require("twitter-lite");
const credentials = require("./.credentials");

const client = new Twitter({
  subdomain: "api", // "api" is the default (change for other subdomains)
  version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: credentials.consumer_key, // from Twitter.
  consumer_secret: credentials.consumer_secret, // from Twitter.
  access_token_key: credentials.access_token_key, // from your User (oauth_token)
  access_token_secret: credentials.access_token_secret, // from your User (oauth_token_secret)
});

client
  .get("account/verify_credentials")
  .then((results) => {
    console.log("results", results);
  })
  .catch(console.error);

var data = [];

function exportJSON(data) {
  json = { data: [] };
  data.forEach((value, index) => {
    json.data.push(value);
  });
  var json = JSON.stringify(json);
  var fs = require("fs");
  fs.writeFileSync("tweets.json", json);
}

const stream = client
  .stream("statuses/filter", { locations: "11.23,44.44,11.44,44.54" })
  .on("start", (response) => console.log("start"))
  .on("data", (tweet) => {
    console.log(tweet.text);
    data.push(tweet);
  })
  .on("ping", () => console.log("ping"))
  .on("error", (error) => console.log("error", error))
  .on("end", (response) => exportJSON(data));

// setTimeout(() => console.log("here"), 1000)
setTimeout(
  () =>
    process.nextTick(() => {
      stream.emit("end");
      stream.removeAllListeners();
    }),
  1000 * 50
);
