import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const defaultPosition = [44.494704, 11.342005];

const Map = ({ tweetsList }) => {
  const markerList = useMemo(
    () =>
      tweetsList.map((tweet, index) => {
        let markerCoords = undefined;

        // Accurate coordinates (a point)
        if (tweet.coordinates && tweet.coordinates.type === 'Point')
          markerCoords = tweet.coordinates.coordinates.reverse();
        
        // Approximated coordinates (a square/rectangle)
        else {
          // Coordinates vector is structured like this [[[BL, TL, TR, BR]]]
          // The response from Twitter are inverted against the format requested by the library
          const BL = tweet.place.bounding_box.coordinates[0][0].reverse();
          const TR = tweet.place.bounding_box.coordinates[0][2].reverse();
          markerCoords = [(BL[0] + TR[0]) / 2, (BL[1] + TR[1]) / 2];
        }

        return (
          <Marker position={markerCoords} key={index}>
            <Popup>
              <b>{tweet.user.name}</b>
              <br />
              <p>{tweet.text}</p>
            </Popup>
          </Marker>
        );
      }),
    [tweetsList]
  );

  return (
    <MapContainer center={defaultPosition} zoom={9} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerList}
    </MapContainer>
  );
};

export default Map;
