import React, { useState } from 'react';
import io from 'socket.io-client';
import { useErrorHandler } from 'react-error-boundary';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';

import Map from './Map';
import CoordsForm from './CoordsForm';
import TweetList from './TweetList';
import NotifySettings from './NotifySettings';
import { generateError } from './AlertWindow';
import WordCloud from './WordCloud';
import Graphs from './Graphs';
import { fakeTweets } from '../misc/fakeTweets';

import { BASE_URL, GEO_FILTER, GET_IDS } from '../constants';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    padding: '1vh',
    height: '100vh',
    overflow: 'scroll',
  },
  header: {
    fontSize: '20px',
  },
  title: {
    margin: '20px',
    textAlign: 'center',
    color: '#1da1f2',
  },
  content: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  leftContent: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    flex: '0 0 auto',
  },
  rightContent: {
    display: 'flex',
    flexFlow: 'column nowrap',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  mapWrapper: {
    flexGrow: 1,
  },
  listWrapper: {
    overflow: 'hidden',
    maxHeight: '40vh',
  },
}));

const MainContainer = () => {
  const classes = useStyles();
  const propagateError = useErrorHandler();
  // To set the id of the current stream
  const [streamId, setStreamId] = useState();
  const [tweets, setTweets] = useState([]);

  const getIDs = async (names) => {
    try {
      // pray that it is formatted correctly
      const res = await axios.get(`${GET_IDS}?names=${names}`);
      return res.data;
    } catch (err) {
      propagateError(generateError("One of the users you asked for doesn't exist!"));
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
      propagateError(generateError("Couldn't start stream on server, please retry!"));
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
      propagateError(generateError("Couldn't stop stream on the server, please retry!"));
    }
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <h1 className={classes.title}>TWITTER TRACKER</h1>
      </header>
      <div className={classes.content}>
        <div className={classes.leftContent}>
          <NotifySettings key="notifySettingsKey" count={tweets.length} />
          <CoordsForm key="coordsFormKey" onStart={startStream} onStop={stopStream} open={!!streamId} />
          {/*<WordCloud key="wordCloudKey" list={tweets} />*/}
          <Graphs key="graphsKey" list={tweets} />
        </div>
        <div className={classes.rightContent}>
          <div className={classes.mapWrapper}>
            <Map tweetsList={tweets} />
          </div>
          <div className={classes.listWrapper}>
            <TweetList list={tweets} setList={setTweets} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
