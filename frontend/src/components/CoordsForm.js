import React, { useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { Fade, Button, CircularProgress, makeStyles } from '@material-ui/core';

import { UserError } from './AlertWindow';
import InputField from './InputField';

const COORDINATE_RE = /^-?[\d]{1,3}[.][\d]+$/;

const useStyles = makeStyles((theme) => ({
  submitButton: {
    margin: 10,
    width: 100,
    fontWeight: 800,
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.light,
    },
  },
}));

const CoordsForm = ({ onStart, onStop, open }) => {
  const { submitButton } = useStyles();
  const launch = useErrorHandler();

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

  const handleParamsChange = (e) =>
    setParams({ ...params, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const values = Object.values(coords);
    // Start a not geolocalized
    if (values.every((value) => value === '')) {
      onStart({ coords: '', params });
    }
    // Start a geolocalized
    else if (values.every((value) => value && COORDINATE_RE.test(value)))
      onStart({ coords, params });
    else {
      const onReset = () =>
        setCoordinates((prevCoords) =>
          Object.keys(prevCoords).forEach((key) => (prevCoords[key] = 0))
        );
      launch(
        UserError('An acceptable input is a number in range [-180.00, 180.00]', onReset)
      );
    }
  };

  return (
    <>
      <InputField
        label="Hashtag"
        fieldName="track"
        text="#"
        handler={handleParamsChange}
      />
      <InputField
        label="Username"
        fieldName="follow"
        text="@"
        handler={handleParamsChange}
      />
      <Button
        variant="contained"
        color="primary"
        className={submitButton}
        onClick={open ? onStop : handleSubmit}
      >
        {open ? 'STOP' : 'START'}
      </Button>
      <Fade in={open} unmountOnExit>
        <CircularProgress />
      </Fade>
    </>
  );
};

export default CoordsForm;
/* 
  ToDo here there are still some cleanings to be done
  Some things are not centered and the CircularProgress just sucks 
  There's a strange issue with autocompleton in the input form
*/
