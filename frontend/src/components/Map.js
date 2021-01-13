import React, { useMemo, useEffect, useState, useCallback } from 'react';
import leaflet from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

import markerImg from '../assets/twitter-marker.png';
import { EditOnlyControl, DrawRectangleControl } from './EditControl';

const defaultPosition = [44.494704, 11.342005];
const THRESHOLD = 0.000001;

const useStyles = makeStyles(() => ({
  list: {
    maxHeight: '300px',
    overflow: 'auto',
    '& .MuiListItem-gutters': {
      padding: '0 10px',
    },
  },
  popup: {
    '& .leaflet-popup-content': {
      margin: '0',
      padding: '0',
    },
  },
  listSecondary: {
    '& p': {
      margin: '0',
      color: 'black',
    },
  },
}));

const getPic = (tweet) =>
  tweet.images.length === 0 ? tweet.user.profile_image_url : tweet.images[0].media_url;

const normalizeList = (tweets) =>
  tweets
    .map((tweet) => {
      const media = (tweet.extended_entities && tweet.extended_entities.media) || [];
      const normalized = {
        id: tweet.id_str,
        text: tweet.text,
        user: tweet.user,
        images: media.filter((item) => item.type === 'photo'),
      };

      // Accurate coordinates (a point)
      if (tweet.coordinates && tweet.coordinates.type === 'Point') {
        return {
          ...normalized,
          coordinates: tweet.coordinates.coordinates,
        };
      }

      // Approximated coordinates (a square/rectangle)
      if (tweet.place && tweet.place.bounding_box) {
        // Coordinates vector is structured like this [[[BL, TL, TR, BR]]]
        const bottomLeftCorner = tweet.place.bounding_box.coordinates[0][0];
        const topRightCorner = tweet.place.bounding_box.coordinates[0][2];
        return {
          ...normalized,
          coordinates: [
            (bottomLeftCorner[0] + topRightCorner[0]) / 2,
            (bottomLeftCorner[1] + topRightCorner[1]) / 2,
          ],
        };
      }

      return null;
    })
    .filter(Boolean)
    .reduce((groups, tweet) => {
      const keys = Object.keys(groups).map((coords) => coords.split(',').map(Number));
      const key = keys.find(
        (coords) => Math.abs(coords[0] - tweet.coordinates[0]) <= THRESHOLD
      );

      if (key) {
        groups[key].push(tweet);
      } else {
        groups[tweet.coordinates.join(',')] = [tweet];
      }

      return groups;
    }, {});

const Map = ({ tweetsList, setCoordinates, showToolbars }) => {
  const classes = useStyles();
  const [bboxRect, setBBoxRect] = useState();
  const markers = useMemo(
    () =>
      Object.entries(normalizeList(tweetsList)).map(([coords, tweets], index) => (
        <Marker
          position={coords.split(',').reverse()}
          key={index}
          icon={
            new leaflet.Icon({
              iconUrl: tweets.length > 1 ? markerImg : getPic(tweets[0]),
              popupAnchor: [0, -15],
              iconSize:
                tweets.length > 1
                  ? new leaflet.Point(22.8, 35.8)
                  : new leaflet.Point(30, 30),
            })
          }
        >
          <Popup className={classes.popup}>
            <List className={classes.list}>
              {tweets.map((tweet) => (
                <ListItem key={tweet.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={tweet.user.name} src={tweet.user.profile_image_url} />
                  </ListItemAvatar>
                  <ListItemText
                    className={classes.listSecondary}
                    primary={tweet.user.name}
                    secondary={tweet.text}
                  />
                  <div>
                    {tweet.images.map((image, tweetIndex) => (
                      <img
                        key={tweetIndex}
                        src={image.media_url}
                        alt="User's shared content"
                        width="80"
                        style={{ display: 'block' }}
                      />
                    ))}
                  </div>
                </ListItem>
              ))}
            </List>
          </Popup>
        </Marker>
      )),
    [tweetsList, classes]
  );

  useEffect(() => {
    if (bboxRect) {
      const { _northEast, _southWest } = bboxRect;
      setCoordinates(_northEast.lat, _northEast.lng, _southWest.lat, _southWest.lng);
    } else {
      setCoordinates('', '', '', '');
    }
  }, [bboxRect, setCoordinates]);

  const onEdit = useCallback((evt) => {
    setBBoxRect(evt.layer._bounds);
  }, []);

  const onDeleted = useCallback((evt) => {
    const layers = evt.layers.getLayers();
    if (layers.length > 0) {
      setBBoxRect(null);
    }
  }, []);

  return (
    <MapContainer center={defaultPosition} zoom={9} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
      <FeatureGroup>
        {showToolbars &&
          (!bboxRect ? (
            <DrawRectangleControl position="topleft" onCreated={onEdit} />
          ) : (
            <EditOnlyControl position="topleft" onEdit={onEdit} onDeleted={onDeleted} />
          ))}
      </FeatureGroup>
    </MapContainer>
  );
};

export default Map;
