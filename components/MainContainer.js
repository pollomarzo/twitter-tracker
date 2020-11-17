import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles, NoSsr } from '@material-ui/core';

import Form from './Form';
import { startStream } from '../twitterAPI/geoStream';

import io from 'socket.io-client';

const Map = dynamic(() => import('./Map'), { ssr: false });

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgb(229, 242, 248)',
  },
  logo: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    height: '250px',
    color: '#1da1f2',
  },
  logoTitle: {
    marginLeft: '-20px',
    color: '#1da1f2',
  },
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
  titleImg: {
    height: '60px',
    width: '60px',
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
  const [tweets, setTweets] = useState([]);

  const startStream = async ({ coords }) => {
    try {
      const res = await axios.post('/api/geoFilter', {
        coordinates: `${coords.longitudeStart},${coords.latitudeStart},${coords.longitudeEnd},${coords.latitudeEnd}`,
      });
      setStreamId(res.data);
      const socket = io('http://localhost:3000');

      socket.emit('register', res.data);

      socket.on('data', (data) => console.log('data'));
    } catch (err) {
      console.error(err);
    }
  };

  const stopStream = async () => {
    try {
      const res = await axios.delete('/api/geoFilter', {
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
    <NoSsr>
      <div className={main}>
        <header className={header}>
          <h1 className={title}>TWITTER TRACKER</h1>
        </header>
        <div className={content}>
          <Form onStart={startStream} onStop={stopStream} open={!!streamId} />
          <div className={mapWrapper}>
            <Map tweetsList={tweets}/>
          </div>
        </div>
        {tweets.length > 0 && (
          <div>
            <h1>Tweets</h1>
            {tweets.map((tweet) => (
              <div>
                {tweet.text} from @{tweet.user.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </NoSsr>
  );
};

export default MainContainer;
