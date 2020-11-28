const express = require('express');
const router = express.Router();
const twitter = require('./twitter');

const converter = (oldParams) => ({
  'user.id_str': oldParams.follow || 'ANY',
  'entities.hashtags': oldParams.track || 'ANY',
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
  // twitter handles "track" content by searching over the whole text. To avoid differences
  // between how we handle (search in hashtag) and twitter, wecan  either prepend '#' to
  // user input or search over whole twitter text ourselves (making us less efficient)
  // alternatively, leave it as is and leave everyone baffled. TODO!
  const streamID = twitter.startStream(converter(constraints), streamParameters);
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(streamID);
});

router.get('/getUserIDs', async (req, res) => {
  const { names } = req.query;
  try {
    const ids = await twitter.getIDs(names);
    res.status(200).json(ids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/geoFilter', (req, res) => {
  const streamID = req.body.id; // should be body
  twitter.closeStream(streamID);
  res.status(200).end();
});

module.exports = router;
