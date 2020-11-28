import React, { useMemo } from 'react';
import leaflet from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import markerImg from '../assets/twitter.svg';

const defaultPosition = [44.494704, 11.342005];

const customMarker = new leaflet.Icon({
  iconUrl: markerImg,
  iconRetinaUrl: markerImg,
  iconAnchor: null,
  popupAnchor: [0, -15],
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new leaflet.Point(30, 30),
  className: 'leaflet-div-icon',
});

const THRESHOLD = 0.000001;

const normalizeList = (tweets) =>
  tweets
    .map((tweet) => {
      // Accurate coordinates (a point)
      if (tweet.coordinates && tweet.coordinates.type === 'Point') {
        return {
          username: tweet.user.name,
          text: tweet.text,
          coordinates: tweet.coordinates.coordinates,
        };
      }

      // Approximated coordinates (a square/rectangle)
      if (tweet.place && tweet.place.bounding_box) {
        // Coordinates vector is structured like this [[[BL, TL, TR, BR]]]
        const bottomLeftCorner = tweet.place.bounding_box.coordinates[0][0];
        const topRightCorner = tweet.place.bounding_box.coordinates[0][2];
        return {
          username: tweet.user.name,
          text: tweet.text,
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

const Map = ({ tweetsList }) => {
  const markers = useMemo(
    () =>
      Object.entries(normalizeList(tweetsList)).map(([coords, tweets], index) => (
        <Marker position={coords.split(',').reverse()} key={index} icon={customMarker}>
          <Popup>
            {tweets.map((tweet) => (
              <>
                <b>{tweet.username}</b>
                <br />
                <p>{tweet.text}</p>
              </>
            ))}
          </Popup>
        </Marker>
      )),
    [tweetsList]
  );

  return (
    <MapContainer center={defaultPosition} zoom={9} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
    </MapContainer>
  );
};

export default Map;
