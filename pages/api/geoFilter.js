const path = require("path");
const dirPath = path.join(process.cwd(), "/twitterAPI");
const twitterAPI = require("../../twitterAPI/geoStream.js");

export default function handler(req, res) {
  return new Promise((resolve) => {
    if (req.method == "POST") {
      const coordinates = req.body.coordinates;
      console.log("starting stream on ", coordinates);
      const streamID = twitterAPI.startStream(coordinates);
      res.send(streamID);
      resolve();
    } else if (req.method == "DELETE") {
      const streamID = req.body.id;
      const { dataJson, error } = twitterAPI.closeStream(streamID);
      res.json(dataJson);
      resolve();
    } else {
      res.end();
    }
  });
}
