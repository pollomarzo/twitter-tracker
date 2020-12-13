import React, { useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { Fade, Button, Typography } from '@material-ui/core';
import { CircularProgress, makeStyles } from '@material-ui/core';

import { generateError } from './AlertWindow';
import InputField from './InputField';

const COORDINATE_RE = /^-?[\d]{1,3}[.][\d]+$/;

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  submitContainer: {
    display: 'flex',
  },
  submitButton: {
    margin: 10,
    width: 100,
    fontWeight: 800,
    color: 'white',
    backgroundColor: '#1DA1F2',
    '&:hover': {
      backgroundColor: 'lightblue',
      color: '#1DA1F2',
    },
  },
}));

const CoordsForm = ({ onStart, onStop, open }) => {
  const { form, submitContainer, submitButton } = useStyles();
  const propagateError = useErrorHandler();
  // A set of coords to initialize a geolocalized stream
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

  const handleCoordChange = (e) =>
    setCoordinates({ ...coords, [e.target.name]: e.target.value });

  const handleParamsChange = (e) =>
    setParams({ ...params, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const values = Object.values(coords);
    // Start a not geolocalized
    if (values.every(value => value === '')) {
      onStart({ coords: '', params });
    }
    // Start a geolocalized
    else if (values.every(value => value && COORDINATE_RE.test(value)))
      onStart({ coords, params });
    else {
      const onReset = () =>
        setCoordinates((coords) =>
          Object.keys(coords).forEach((key) => (coords[key] = 0))
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
    <div className={form}>
      <div className="inputForm">
        <Typography>North-East Corner</Typography>
        <InputField
          label="Longitude"
          fieldName="longitudeNE"
          handler={handleCoordChange}
        />
        <InputField label="Latitude" fieldName="latitudeNE" handler={handleCoordChange} />
      </div>
      <div className="inputForm">
        <Typography>South-West Corner</Typography>
        <InputField
          label="Longitude"
          fieldName="longitudeSW"
          handler={handleCoordChange}
        />
        <InputField label="Latitude" fieldName="latitudeSW" handler={handleCoordChange} />
      </div>
      <div className="inputForm">
        <Typography>Hashtag</Typography>
        <InputField fieldName="track" text="#" handler={handleParamsChange} />
      </div>
      <div className="inputForm">
        <Typography>User</Typography>
        <InputField fieldName="follow" text="@" handler={handleParamsChange} />
      </div>

      <div className={submitContainer}>
        {open ? (
          <Button
            onClick={onStop}
            variant="contained"
            className={submitButton}
            color="default"
          >
            STOP
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            className={submitButton}
            color="default"
          >
            START
          </Button>
        )}

        <div>
          <Fade in={open} unmountOnExit>
            <CircularProgress />
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default CoordsForm;
