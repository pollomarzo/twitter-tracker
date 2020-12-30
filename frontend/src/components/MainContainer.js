import React, { useState, useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import io from 'socket.io-client';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import { Grid, Typography, makeStyles } from '@material-ui/core';

import { BASE_URL, GEO_FILTER, GET_IDS, REQUEST_TOKEN, MAP_ID } from '../constants';
import { CollapsableBox, CoordsForm, Map, InsightTabs, TweetList, WordCloud } from '.';
//import { Map, CoordsForm, TweetList, NotifySettings, WordCloud, ScheduleTweet } from '.';
import { UserError } from './AlertWindow';
import { useUser } from '../context/UserContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.default,
  },
  
  mapContainer: {
    height: 850,
    '& .leaflet-container': {
      margin: 20,
      width: '95%',
      height: '95%',
    },
  },
}));

const MainContainer = () => {
  const [coordinates, setCoordinates] = useState({
    ne: {
      lat: null,
      lng: null,
    },
    sw: {
      lat: null,
      lng: null,
    },
  });
  const launch = useErrorHandler();
  // To set the id of the current stream
  const { authProps } = useUser();
  const [streamId, setStreamId] = useState();
  const [tweets, setTweets] = useState([]);
  const { paper, mapContainer } = useStyles();

  const getIDs = async (names) => {
    try {
      // pray that it is formatted correctly
      const res = await axios.get(`${GET_IDS}?names=${names}`);
      return res.data;
    } catch (err) {
      launch(UserError("One of the users you asked for doesn't exist!"));
    }
  };

  const startStream = async ({ coords, params }) => {
    let streamParameters; // in OR
    let constraints; // in AND, AFTER collection
    if (params.follow) {
      params.follow = await getIDs(params.follow);
    }
    // if coordinates were given, they have the priority, and after we'll check everything else
    if (coords) {
      streamParameters = {
        locations: `${coords.longitudeSW},${coords.latitudeSW},${coords.longitudeNE},${coords.latitudeNE}`,
      };
      constraints = params;
    }
    // if a username is given, we want to know everything he's tweeted, and then select on hashtag
    else if (params.follow) {
      streamParameters = {
        follow: params.follow,
      };
      constraints = { track: params.track };
    }
    // otherwise, we only select based on hashtag
    else if (params.track) {
      streamParameters = {
        track: params.track,
      };
      constraints = {};
    }

    try {
      const res = await axios.post(GEO_FILTER, {
        streamParameters,
        constraints,
      });
      setStreamId(res.data);
      const socket = io(BASE_URL, {
        transports: ['websocket'],
        path: '/socket', // needed for cors in dev
      });
      socket.emit('register', res.data);
      socket.on('tweet', (tweet) => {
        console.log(tweet);
        setTweets((prevTweets) => [...prevTweets, tweet]);
      });
      socket.on('error', (error) => console.log(error));
    } catch (err) {
      launch(UserError("Couldn't start stream on server, please retry!"));
    }
  };

  const stopStream = async () => {
    try {
      await axios.delete(GEO_FILTER, {
        data: { id: streamId },
        headers: { Authorization: '***' },
      });
      setStreamId(null);
    } catch (err) {
      launch(UserError("Couldn't stop stream on the server, please retry!"));
    }
  };

  const handleAuthentication = async () => {
    try {
      const res = await axios.get(REQUEST_TOKEN);
      console.log(res);
      window.location.replace(
        `https://api.twitter.com/oauth/authenticate?oauth_token=${res.data.token}`
      );
    } catch (err) {
      console.error(err.response);
    }
  };

  const onAddRect = useCallback(
    (nelat, nelng, swlat, swlng) =>
      setCoordinates({
        ne: { lat: nelat, lng: nelng },
        sw: { lat: swlat, lng: swlng },
      }),
    []
  );

  return (
    <div className={paper}>
      <header>
        <Typography color="primary" variant="h4" align="center">
          TWITTER TRACKER
        </Typography>
        {/* Here goes the tooltips */}
      </header>

      {/* Box with stream params */}
      <CollapsableBox name="Stream params">
        <CoordsForm onStart={startStream} onStop={stopStream} open={streamId} />
      </CollapsableBox>

      {/* Grid layout for Map and InsightTabs */}
      <Grid container>
        <Grid item xs={6} id={MAP_ID} className={mapContainer}>
          <Map tweetsList={tweets} setCoordinates={onAddRect} showToolbars={!streamId} />
        </Grid>
        <Grid item xs={6}>
          <InsightTabs>
            <TweetList list={tweets} setList={setTweets} tabName="Tweet List" />
            <WordCloud list={tweets} tabName="Wordcloud" />
            {/* TODO here will go Graphs from Lorenz */}
          </InsightTabs>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainContainer;
/*
      <div >
        <div>
          <NotifySettings count={tweets.length} />
          <ScheduleTweet handleAuth={handleAuthentication} />
          </div>
          <div>
          <div id={MAP_ID}>
          <WordCloud list={tweets} />
            <Map
              tweetsList={tweets}
              setCoordinates={onAddRect}
              showToolbars={!streamId}
            />
          </div>
          <div >
            <TweetList list={tweets} setList={setTweets} />
          </div>
        </div>
      </div>
*/
