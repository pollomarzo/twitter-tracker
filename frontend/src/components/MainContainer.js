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
    height: '10%',
    marginTop: 10,
    marginBottom: 10,
  },

  mainContainer: {
    height: 850,
    '& .leaflet-container': {
      margin: 20,
      width: '95%',
      height: '84vh',
    },
  },
}));

const socket = io(BASE_URL, {
  transports: ['websocket'],
  path: '/socket', // needed for cors in dev
});

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
  const [streamId, setStreamId] = useState();
  const [tweets, setTweets] = useState([]);
  const [tweetsFiltered, setTweetsFiltered] = useState(tweets);
  const [streamError, setStreamError] = useState();
  const [coords, setCoords] = useState({
    latitudeSW: '',
    longitudeSW: '',
    latitudeNE: '',
    longitudeNE: '',
  });
  const [params, setParams] = useState({
    track: '', // hashtag
    follow: '', // user
  });
  useEffect(() => {
    setTweetsFiltered(tweets);
  }, [tweets]);

  //cookie
  useEffect(() => {
    const fetchSettings = async (streamId) => {
      try {
        const res = await axios.get(`${SETTINGS}?streamId=${streamId}`);
        const settings = res.data;

        if (settings.locations) {
          const coords = settings.locations.split(',');
          setCoords({
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

  const startStream = async ({ coords, params }) => {
    let streamParameters; // in OR
    let constraints; // in AND, AFTER collection
    let follow = undefined;
    if (params.follow) {
      try {
        // pray that it is formatted correctly
        const res = await axios.get(`${GET_IDS}?names=${params.follow}`);
        follow = res.data;
      } catch (err) {
        propagateError(generateError("One of the users you asked for doesn't exist!"));
        return;
      }
    }

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
      launch(UserError("Couldn't start stream on server, please retry!"));
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
      launch(UserError("Couldn't stop stream on the server, please retry!"));
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

  const onAddRect = useCallback(
    (nelat, nelng, swlat, swlng) =>
      setCoordinates({
        ne: { lat: nelat, lng: nelng },
        sw: { lat: swlat, lng: swlng },
      }),
    []
  );
  const handleCoordChange = (e) =>
    setCoords({ ...coords, [e.target.name]: e.target.value });

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
        setCoords((prevCoords) =>
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
    <div className={paper}>
      <Grid container className={header} justifyContent="space-around" alignItems="center" >
        {/* Box with stream params */}
        <Grid item xs={4}>
          <ShowDialogIcon icon={<Settings />} name="Stream settings" desc={FABsDesc['params']}>
            <CoordsForm onStart={startStream} onStop={stopStream} open={streamId} />
          </ShowDialogIcon>
        </Grid>
        <Grid item xs={4}>
          <Typography color="primary" variant="h3" align="center" justifyContent="center">
            TWITTER TRACKER
          </Typography>
        </Grid>
        <Grid item container xs={4} justify="flex-end">
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
        <Grid item xs={6} className={mainContainer}>
          <Map tweetsList={tweets} setCoordinates={onAddRect} showToolbars={!streamId} />
        </Grid>
        <Grid item xs={6} className={mainContainer}>
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
