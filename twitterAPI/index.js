const { v4: uuidv4 } = require("uuid/v4");
const Twitter = require("twitter-lite");

class TwitterAPI {
  constructor(credentials) {
    this.client = new Twitter({
      subdomain: "api",
      version: "1.1",
      ...credentials,
    });

    this.client
      .get("account/verify_credentials")
      .then(() => (this.auth = true))
      .catch(() => (this.auth = false));
    this.streams = {};
  }

  startStream(locations) {
    const streamId = uuidv4();
    const stream = this.client.stream("statuses/filter", { locations });
    stream.on("start", () => {
      this.streams[streamId] = { stream, data: [], error: null };
    });
    stream.on("error", (error) => (this.streams[streamId].error = error)); //todo handler error
    stream.on("data", (tweet) => {
      this.streams[streamId].data.push(tweet);
    });
    stream.on("end", () => delete this.streams[streamId]);
  }

  closeStream(streamId) {
    const { stream, data, error } = this.streams[streamId];
    stream.emit("end");
    return { data, error };
  }
}

module.exports = new TwitterAPI({
  consumer_key: credentials.consumer_key, // from Twitter.
  consumer_secret: credentials.consumer_secret, // from Twitter.
  access_token_key: credentials.access_token_key, // from your User (oauth_token)
  access_token_secret: credentials.access_token_secret, // from your User (oauth_token_secret);
});
