const express = require('express');
const router = express.Router();
const twitter = require('./twitter');

router.post('/geoFilter', (req, res) => {
  const parameters = {
    track: req.body.track ? req.body.track : '',
    follow: req.body.follow ? req.body.follow : '',
    locations: req.body.coordinates ? req.body.coordinates : '',
  };

  const fields = req.body.fields ? req.body.fields : '';
  const streamID = twitter.startStream(fields, parameters);
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(streamID);
});

router.delete('/geoFilter', (req, res) => {
  const streamID = req.body.id; // should be body
  twitter.closeStream(streamID);
  res.status(200).end();
});

module.exports = router;
