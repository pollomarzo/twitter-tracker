import React, { useState } from 'react';
import io from 'socket.io-client';
import { useErrorHandler } from 'react-error-boundary';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';

import Map from './Map';
import CoordsForm from './CoordsForm';
import TweetList from './TweetList';
import { generateError } from './AlertWindow';
import WordCloud from './WordCloud';

import { BASE_URL, GEO_FILTER, GET_IDS } from '../constants';

const useStyles = makeStyles(() => ({
  main: {
    height: 'calc(100vh - 20px)',
    width: 'calc(100vw - 20px)',
    margin: '10px',
    padding: '10px',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'solid 4px #1da1f2',
    borderRadius: '10px',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20px',
  },
  title: {
    margin: '20px',
    textAlign: 'center',
    color: '#1da1f2',
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  leftContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  mapWrapper: {
    flexGrow: 2,
  },
}));

const MainContainer = () => {
  const { main, header, title, content, leftContent, mapWrapper } = useStyles();
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
    <div className={main}>
      <header className={header}>
        <h1 className={title}>TWITTER TRACKER</h1>
      </header>
      <div className={content}>
        <div className={leftContent}>
          <CoordsForm onStart={startStream} onStop={stopStream} open={!!streamId} />
        </div>
        <div className={mapWrapper}>
          <Map tweetsList={tweets} />
        </div>
      </div>
      <div className="container">
        <WordCloud list={tweets} />
        <TweetList list={tweets} setList={setTweets} />
      </div>
    </div>
  );
};

export default MainContainer;
