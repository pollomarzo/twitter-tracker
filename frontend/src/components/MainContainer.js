import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import io from 'socket.io-client';

import Map from './Map';
import CoordsForm from './CoordsForm';
import TweetList from './TweetList';

import { BASE_URL, GEO_FILTER } from '../constants';
// Testing only ToDo remove
import { fakeTweets } from '../misc/fakeTweets';

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
  // To set the id of the current stream
  const [streamId, setStreamId] = useState();
  const [tweets, setTweets] = useState(fakeTweets);
  const [streamError, setStreamError] = useState();

  const startStream = async ({ coords, params }) => {
    setTweets([]);
    try {
      const res = await axios.post(GEO_FILTER, {
        coordinates: `${coords.longitudeSW},${coords.latitudeSW},${coords.longitudeNE},${coords.latitudeNE}`,
        //...params <-- this is what i wish we could do. but twitter API uses OR..
      });
      setStreamId(res.data);
      const socket = io(BASE_URL, {
        transports: ['websocket'],
        path: '/socket', // needed for cors in dev
      });
      socket.emit('register', res.data);
      socket.on('tweet', (tweet) => {
        console.log(tweet);
        // consider including parameter verification here. CONSIDER!
        setTweets((prevTweets) => [...prevTweets, tweet]);
      });
      socket.on('error', (error) => setStreamError(error));
    } catch (err) {
      console.error(err);
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
      console.error(err);
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
          {streamError && (
            <Alert severity="error" variant="filled">
              <AlertTitle>Error</AlertTitle>
              {streamError.source}
            </Alert>
          )}
        </div>
        <div className={mapWrapper}>
          <Map tweetsList={tweets} />
        </div>
      </div>
      <div className="tweetList">
        <TweetList list={tweets} />
      </div>
    </div>
  );
};

export default MainContainer;
