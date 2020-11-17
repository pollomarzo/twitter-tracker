const path = require('path');
const dirPath = path.join(process.cwd(), '/twitterAPI');
const twitterAPI = require('../../twitterAPI/geoStream.js');

export default function handler(req, res) {
  return new Promise((resolve) => {
    switch (req.method) {
      case 'POST': {
        const parameters = {
          track: req.body.track ? req.body.track : '',
          follow: req.body.follow ? req.body.follow : '',
          locations: req.body.coordinates ? req.body.coordinates : '',
        };
        const type = req.body.type;
        const coordinates = req.body.coordinates;
        console.log('starting stream on ', coordinates);
        const streamID = twitterAPI.startStream(type, parameters);
        res.setHeader('Content-Type', 'text/plain');
        res.send(streamID);
        return resolve();
      }
      case 'DELETE': {
        const streamID = req.body.id; //should be body
        console.log(streamID);
        const { dataJson, error } = twitterAPI.closeStream(streamID);
        res.json(dataJson);
        return resolve();
      }
      default:
        res.end();
    }
  });
}
