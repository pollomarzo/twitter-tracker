const express = require('express');
const router = express.Router();
const twitter = require('./twitter');

const converter = (oldParams) => ({
  'user.id_str': oldParams.follow || 'ANY',
  'entities.hashtags': oldParams.track || 'ANY'
});

// twitter API expects
//   - username: follow
//   - hashtags: track
//   - coordinates: locations
// in request, I expect streamParameters and constraints. 
// *The first in OR, the second in AND, in succession*
router.post('/geoFilter', (req, res) => {
  const { streamParameters, constraints } = req.body;
  console.log(`RECEIVED REQ with constraints and params`, constraints, streamParameters);
  const streamID = twitter.startStream(converter(constraints), streamParameters);
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(streamID);
});

router.delete('/geoFilter', (req, res) => {
  const streamID = req.body.id; // should be body
  twitter.closeStream(streamID);
  res.status(200).end();
});

module.exports = router;
