import React, { useState } from 'react';
import { CircularProgress, Fade, Button, makeStyles } from '@material-ui/core';
import { AlertWindow, InputField } from '.';

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
    latitudeStart: 0,
    latitudeEnd: 0,
    longitudeStart: 0,
    longitudeEnd: 0,
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
      <InputField
        label="Longitude start"
        fieldName="longitudeStart"
        handler={handleChange}
      />
      <InputField
        label="Latitude start"
        fieldName="latitudeStart"
        handler={handleChange}
      />
      <InputField label="Longitude end" fieldName="longitudeEnd" handler={handleChange} />
      <InputField label="Latitude end" fieldName="latitudeEnd" handler={handleChange} />

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
