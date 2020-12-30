import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import io from 'socket.io-client';
import { useErrorHandler } from 'react-error-boundary';

import Map from './Map';
import CoordsForm from './CoordsForm';
import TweetList from './TweetList';
import NotifySettings from './NotifySettings';
import { generateError } from './AlertWindow';
import WordCloud from './WordCloud';
import StartStopStream from './StartStopStream';
import { fakeTweets } from '../misc/fakeTweets';
import { MAP_ID } from '../constants';

import { useUser } from '../context/UserContext';

import {
  BASE_URL,
  GEO_FILTER,
  GET_IDS,
  REQUEST_TOKEN,
  SEND_TWEET,
  SETTINGS,
} from '../constants';
// TODO: For testing purposes only, needs to be removed for production
import ScheduleTweet from './ScheduleTweet';

function getCookieValue(a) {
  const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : null;
}

const COORDINATE_RE = /^-?[\d]{1,3}[.][\d]+$/;

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

const socket = io(BASE_URL, {
  transports: ['websocket'],
  path: '/socket', // needed for cors in dev
});

const MainContainer = () => {
  const classes = useStyles();
  const propagateError = useErrorHandler();
  // To set the id of the current stream
  const [streamId, setStreamId] = useState();
  const [tweets, setTweets] = useState([]);
  const [streamError, setStreamError] = useState();
  const [coords, setCoordinates] = useState({
    latitudeSW: '',
    longitudeSW: '',
    latitudeNE: '',
    longitudeNE: '',
  });
  const [params, setParams] = useState({
    track: '', // hashtag
    follow: '', // user
  });

  //cookie
  useEffect(() => {
    const fetchSettings = async (streamId) => {
      try {
        const res = await axios.get(`${SETTINGS}?streamId=${streamId}`);
        const settings = res.data;

        if (settings.locations) {
          const coords = settings.locations.split(',');
          setCoordinates({
            latitudeSW: coords[1],
            longitudeSW: coords[0],
            latitudeNE: coords[3],
            longitudeNE: coords[2],
          });
        }

        if (settings.track) {
          setParams({ track: settings.track });
        }

        if (settings.follow) {
          setParams({ follow: settings.follow });
        }
      } catch (err) {
        console.error(err);
      }
    };

    const oldStreamId = getCookieValue('streamId');

    if (oldStreamId) {
      setStreamId(oldStreamId);
      fetchSettings(oldStreamId);
      socket.emit('attach', { streamId: oldStreamId });
      socket.on('tweet', (tweet) => {
        setTweets((prevTweets) => [...prevTweets, tweet]);
      });
    }
  }, []);

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
    const follow = params.follow && (await getIDs(params.follow));

    // if coordinates were given, they have the priority, and after we'll check everything else
    if (coords) {
      streamParameters = {
        locations: `${coords.longitudeSW},${coords.latitudeSW},${coords.longitudeNE},${coords.latitudeNE}`,
      };
      constraints = { ...params, follow };
    }
    // if a username is given, we want to know everything he's tweeted, and then select on hashtag
    else if (params.follow) {
      streamParameters = { follow };
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
      const res = await axios.post(
        GEO_FILTER,
        {
          streamParameters,
          constraints,
        },
        {
          withCredentials: true,
        }
      );

      setStreamId(res.data);
      socket.emit('attach', { streamId: res.data });
      socket.on('tweet', (tweet) => {
        setTweets((prevTweets) => [...prevTweets, tweet]);
      });
      socket.on('error', console.log);
    } catch (err) {
      propagateError(generateError("Couldn't start stream on server, please retry!"));
    }
  };

  const stopStream = async () => {
    try {
      await axios.delete(GEO_FILTER, {
        data: { id: streamId },
        headers: { Authorization: '***' },
        withCredentials: true,
      });
      setStreamId(null);
      socket.off('tweet');
      socket.off('error');
      document.cookie = 'streamId=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } catch (err) {
      propagateError(generateError("Couldn't stop stream on the server, please retry!"));
    }
  };

  const handleAuthentication = async () => {
    try {
      const res = await axios.get(REQUEST_TOKEN);
      window.location.replace(
        `https://api.twitter.com/oauth/authenticate?oauth_token=${res.data.token}`
      );
    } catch (err) {
      console.error(err.response);
    }
  };

  const handleCoordChange = (e) =>
    setCoordinates({ ...coords, [e.target.name]: e.target.value });

  const handleParamsChange = (e) =>
    setParams({ ...params, [e.target.name]: e.target.value });

  const handleStart = () => {
    const values = Object.values(coords);
    // Start a not geolocalized
    if (values.every((value) => value === '')) {
      startStream({ coords: '', params });
    }
    // Start a geolocalized
    else if (values.every((value) => value && COORDINATE_RE.test(value)))
      startStream({ coords, params });
    else {
      const onReset = () =>
        setCoordinates((prevCoords) =>
          Object.keys(prevCoords).forEach((key) => (prevCoords[key] = 0))
        );
      propagateError(
        generateError(
          'An acceptable input is a number in range [-180.00, 180.00]',
          onReset
        )
      );
    }
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <h1 className={classes.title}>TWITTER TRACKER</h1>
      </header>
      <div className={classes.content}>
        <div className={classes.leftContent}>
          <NotifySettings count={tweets.length} />
          <StartStopStream stopStream={() => setStreamId(null)} streamId={streamId} />
          <CoordsForm
            open={!!streamId}
            coords={coords}
            params={params}
            onStart={handleStart}
            onStop={stopStream}
            onCoordChange={handleCoordChange}
            onParamChange={handleParamsChange}
          />
          <ScheduleTweet handleAuth={handleAuthentication} />
          {streamError && (
            <Alert severity="error" variant="filled">
              <AlertTitle>Error</AlertTitle>
              {streamError.source}
            </Alert>
          )}
          <WordCloud list={tweets} />
        </div>
        <div className={classes.rightContent}>
          <div id={MAP_ID} className={classes.mapWrapper}>
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
//liso cacca
