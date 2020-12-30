import React, { useState, useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import io from 'socket.io-client';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import { Grid, Typography, makeStyles } from '@material-ui/core';
import Settings from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import AlarmIcon from '@material-ui/icons/Alarm';
import EmailIcon from '@material-ui/icons/Email';

import { BASE_URL, GEO_FILTER, GET_IDS, REQUEST_TOKEN, FABsDesc } from '../constants';
import { ShowDialogIcon, CoordsForm, Map, InsightTabs, TweetList, WordCloud } from '.';
import { NotifySettings, ScheduleTweet } from '.';
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

  header: {
    marginTop: 15,
    marginBottom: 15,
  },

  mapContainer: {
    height: 850,
    '& .leaflet-container': {
      margin: 20,
      width: '95%',
      height: '84vh',
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
  const { paper, header, mapContainer } = useStyles();

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
      <Grid container className={header}>
        {/* Box with stream params */}
        <Grid item xs={4}>
          <ShowDialogIcon icon={<Settings />} name="Stream settings" desc={FABsDesc['params']}>
            <CoordsForm onStart={startStream} onStop={stopStream} open={streamId} />
          </ShowDialogIcon>
        </Grid>
        <Grid item xs={4}>
          <Typography color="primary" variant="h4" align="center">
            TWITTER TRACKER
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ShowDialogIcon icon={<SearchIcon />} iconOnly name="Filter tweets" desc={FABsDesc['filter']}>
            <NotifySettings count={tweets.length} />
          </ShowDialogIcon>
          <ShowDialogIcon icon={<AlarmIcon />} iconOnly name="Scheduled tweet"  desc={FABsDesc['schedule']}>
            <ScheduleTweet handleAuth={handleAuthentication} />
          </ShowDialogIcon>
          <ShowDialogIcon icon={<EmailIcon />} iconOnly name="E-mail notification"  desc={FABsDesc['email']}>
            <NotifySettings count={tweets.length} />
          </ShowDialogIcon>
        </Grid>
        {/* Here goes the tooltips */}
      </Grid>

      {/* Grid layout for Map and InsightTabs */}
      <Grid container>
        <Grid item xs={6} className={mapContainer}>
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
