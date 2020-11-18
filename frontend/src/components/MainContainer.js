import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import io from 'socket.io-client';

import Map from './Map';
import Form from './Form';
import TweetCard from './TweetCard';

import { BASE_URL, GEO_FILTER } from '../constants';
// Testing only ToDo remove
import { fakeTweets } from '../misc/fakeTweets';

const useStyles = makeStyles(() => ({
  main: {
    height: 'calc(100vh - 60px)',
    width: 'calc(100vw - 60px)',
    margin: '30px',
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
  mapWrapper: {
    flexGrow: 2,
  },
}));

const MainContainer = () => {
  const { main, header, title, content, mapWrapper } = useStyles();
  // To set the id of the current stream
  const [streamId, setStreamId] = useState(undefined);
  const [tweets, setTweets] = useState(fakeTweets);

  const startStream = async ({ coords }) => {
    try {
      const res = await axios.post(GEO_FILTER, {
        coordinates: `${coords.longitudeSW},${coords.latitudeSW},${coords.longitudeNE},${coords.latitudeNE}`,
      });
      setStreamId(res.data);
      const socket = io(BASE_URL, {
        transports: ['websocket'],
        path: '/socket', // needed for cors in dev
      });
      socket.emit('register', res.data);
      socket.on('tweet', (tweet) => {
        console.log(tweet);
        setTweets((tweets) => [...tweets, tweet]);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const stopStream = async () => {
    try {
      const res = await axios.delete(GEO_FILTER, {
        data: { id: streamId },
        headers: { Authorization: '***' },
      });
      setStreamId(null);
      setTweets(res.data);
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
        <Form onStart={startStream} onStop={stopStream} open={!!streamId} />
        <div className={mapWrapper}>
          <Map tweetsList={tweets} />
        </div>
      </div>
      {tweets.length > 0 && (
        <Paper>
          <Typography variant='h4'>Tweets</Typography>
          <Grid container spacing={3}>
            {tweets.map((tweet, index) => <TweetCard key={index} {...tweet} />)}
          </Grid>
        </Paper>
      )}
    </div>
  );
};

export default MainContainer;
