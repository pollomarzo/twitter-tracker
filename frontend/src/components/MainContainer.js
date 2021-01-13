import React, { useState, useEffect, useCallback } from 'react';

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

import {
  BASE_URL,
  GEO_FILTER,
  GET_IDS,
  REQUEST_TOKEN,
  SETTINGS,
  FABsDesc,
} from '../constants';
import { ShowDialogIcon, StreamParams, Map, InsightTabs, TweetList, WordCloud } from '.';
import { NotifySettings, ScheduleTweet, Filters, Graphs } from '.';
import { UserError } from './AlertWindow';

import { MAP_ID } from '../constants';

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
    overflow: 'hidden',
  },
  header: {
    height: '15%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  mainContainer: {
    height: '85%',
  },
  sideContainer: {
    height: '100%',
    padding: theme.spacing(1),
    '& #map, & .leaflet-container': {
      width: '100%',
      height: '100%',
    },
  },
  settingsIcon: {
    marginRight: theme.spacing(1),
  },
}));

const socket = io(BASE_URL, {
  transports: ['websocket'],
  path: '/socket', // needed for cors in dev
});

function getCookieValue(a) {
  const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : null;
}

const COORDINATE_RE = /^-?[\d]{1,3}[.][\d]+$/;

const MainContainer = () => {
  const launch = useErrorHandler();
  const { paper, header, mainContainer, sideContainer, settingsIcon } = useStyles();
  // To set the id of the current stream
  const [streamId, setStreamId] = useState();
  const [tweets, setTweets] = useState([]);
  const [tweetsFiltered, setTweetsFiltered] = useState(tweets);

  const [coords, setCoords] = useState({
    ne: {
      lat: '',
      lng: '',
    },
    sw: {
      lat: '',
      lng: '',
    },
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
    const fetchSettings = async (id) => {
      try {
        const res = await axios.get(`${SETTINGS}?streamId=${id}`);
        const settings = res.data;

        if (settings.locations) {
          const coordinates = settings.locations.split(',');
          setCoords({
            ne: {
              lat: coordinates[3],
              lng: coordinates[2],
            },
            sw: {
              lat: coordinates[1],
              lng: coordinates[0],
            },
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
        launch(UserError("One of the users you asked for doesn't exist!"));
        return;
      }
    }

    // if coordinates were given, they have the priority, and after we'll check everything else
    if (coords) {
      streamParameters = {
        locations: `${coords.sw.lng},${coords.sw.lat},${coords.ne.lng},${coords.ne.lat}`,
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
      socket.on('error', (err) => {
        if (err.source && err.source === 'Exceeded connection limit for user') {
          launch(UserError('Exceeded connection limit'));
        }
      });
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
      setCoords({
        ne: { lat: nelat, lng: nelng },
        sw: { lat: swlat, lng: swlng },
      }),
    []
  );

  const handleParamsChange = (e) =>
    setParams({ ...params, [e.target.name]: e.target.value });

  const handleStart = () => {
    // get all values flattened
    const values = Object.values(coords)
      .map((value) => [value.lat, value.lng])
      .flat();
    // Start a not geolocalized
    if (values.every((value) => value === '')) {
      startStream({ coords: '', params });
    }
    // Start a geolocalized
    else if (values.every((value) => value && COORDINATE_RE.test(value)))
      startStream({ coords, params });
    else {
      const onReset = () =>
        setCoords({
          ne: {
            lat: '',
            lng: '',
          },
          sw: {
            lat: '',
            lng: '',
          },
        });
      launch(UserError('There is an error with your geolocalized box', onReset));
    }
  };

  return (
    <div className={paper}>
      <Grid container className={header} justify="space-around" alignItems="center">
        {/* Box with stream params */}
        <Grid item xs={4}>
          <ShowDialogIcon
            icon={<Settings className={settingsIcon} />}
            name={!streamId ? 'Start' : 'Running...'}
            desc={FABsDesc['params']}
          >
            <StreamParams
              activeStream={streamId}
              params={params}
              onStart={handleStart}
              onStop={stopStream}
              onParamChange={handleParamsChange}
            />
          </ShowDialogIcon>
        </Grid>
        <Grid item xs={4}>
          <Typography color="primary" variant="h3" align="center" justify="center">
            TWITTER TRACKER
            <Typography>{tweets.length} tweets collected</Typography>
          </Typography>
        </Grid>
        <Grid item container xs={4} justify="flex-end">
          <ShowDialogIcon
            icon={<SearchIcon />}
            iconOnly
            name="Filter tweets"
            desc={FABsDesc['filter']}
          >
            <Filters list={tweets} setFilteredList={setTweetsFiltered} />
          </ShowDialogIcon>
          <ShowDialogIcon
            icon={<AlarmIcon />}
            iconOnly
            name="Scheduled tweet"
            desc={FABsDesc['schedule']}
          >
            <ScheduleTweet handleAuth={handleAuthentication} />
          </ShowDialogIcon>
          <ShowDialogIcon
            icon={<EmailIcon />}
            iconOnly
            name="E-mail notification"
            desc={FABsDesc['email']}
            disabled={!streamId}
          >
            <NotifySettings streamId={streamId} />
          </ShowDialogIcon>
        </Grid>
      </Grid>

      {/* Grid layout for Map and InsightTabs */}
      <Grid container className={mainContainer}>
        <Grid item xs={6} className={sideContainer}>
          <div id={MAP_ID}>
            <Map
              tweetsList={tweetsFiltered}
              setCoordinates={onAddRect}
              showToolbars={!streamId}
            />
          </div>
        </Grid>
        <Grid item xs={6} className={sideContainer}>
          <InsightTabs>
            <TweetList list={tweetsFiltered} setList={setTweets} tabName="Tweet List" />
            <WordCloud list={tweetsFiltered} tabName="Wordcloud" />
            <Graphs list={tweetsFiltered} tabName="Graphs" />
          </InsightTabs>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainContainer;
