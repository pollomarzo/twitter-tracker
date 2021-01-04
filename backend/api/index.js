const express = require('express');
const twitter = require('./twitter');
const router = express.Router();

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
  const streamID = twitter.startStream(constraints, streamParameters);
  res.setHeader('Content-Type', 'text/plain');
  res.cookie('streamId', streamID, { maxAge: 259200000 });
  res.status(200).send(streamID);
});

router.delete('/geoFilter', (req, res) => {
  const streamID = req.body.id; // should be body
  twitter.closeStream(streamID);
  res.status(200).end();
});

router.get('/getUserIDs', async (req, res) => {
  const { names } = req.query;
  try {
    const ids = await twitter.getIDs(names);
    res.status(200).json(ids);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/notification', (req, res) => {
  const { streamId, email, treshold } = req.body;
  twitter.setNotification({ streamId, email, treshold });
  res.status(200).json({});
});

router.post('/sendTweet', async (req, res) => {
  const { msg, authProps } = req.body;
  try {
    const response = await twitter.sendTweet(msg, authProps);
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

router.get('/requestToken', async (req, res) => {
  try {
    const response = await twitter.requestToken();
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/auth', async (req, res) => {
  const { oauthToken, oauthVerifier } = req.query;
  try {
    const response = await twitter.requestAccess(oauthToken, oauthVerifier);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/settings', async (req, res) => {
  const { streamId } = req.query;
  try {
    const params = await twitter.getSettings(streamId);
    res.status(200).send(params);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

module.exports = router;
