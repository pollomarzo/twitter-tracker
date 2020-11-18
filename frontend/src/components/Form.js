import React, { useState } from 'react';
import { CircularProgress, Fade, Button, makeStyles, Typography } from '@material-ui/core';

import AlertWindow from './AlertWindow';
import InputField from './InputField';

const COORDINATE_RE = RegExp('^-?[1]?[0-8]?[0-9][.][0-9]{2}$');

const useStyles = makeStyles(() => ({
  form: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  submitContainer: {
    display: 'flex',
    alignItems: 'center',
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
  // A set of coords to initialize a geolocalized stream
  const [coords, setCoordinates] = useState({
    latitudeSW: 0,
    longitudeSW: 0,
    latitudeNE: 0,
    longitudeNE: 0,
  });
  const [error, setError] = useState(false);

  const handleChange = (e) =>
    setCoordinates({ ...coords, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const values = Object.values(coords);
    if (values.every((value) => value && COORDINATE_RE.test(value))) {
      onStart({ coords });
    } else {
      setError(true);
    }
  };

  return (
    <div className={form}>
      <div>
        <Typography variant='title'>North-East Corner</Typography>
        <InputField label="Longitude" fieldName="longitudeNE" handler={handleChange} />
        <InputField label="Latitude" fieldName="latitudeNE" handler={handleChange} />
      </div>
      <div>
        <Typography variant='title'>South-West Corner</Typography>
        <InputField label="Longitude" fieldName="longitudeSW" handler={handleChange} />
        <InputField label="Latitude" fieldName="latitudeSW" handler={handleChange} />
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
      <AlertWindow
        isOpen={error}
        onConfirm={setError}
        title="Error"
        msg="An acceptable input is a number in range [-180.00, 180.00] written with this formula"
      />
    </div>
  );
};

export default CoordsForm;
