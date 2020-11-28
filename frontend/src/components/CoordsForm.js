import React, { useState } from 'react';
import {
  CircularProgress,
  Fade,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';

import AlertWindow from './AlertWindow';
import InputField from './InputField';

const COORDINATE_RE = /^-?[\d]{1,3}[.][\d]+$/;

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
    latitudeSW: '',
    longitudeSW: '',
    latitudeNE: '',
    longitudeNE: '',
  });
  const [params, setParams] = useState({
    track: '', // hashtag
    follow: '', // user
  });
  const [errors, setErrors] = useState([]);

  const handleCoordChange = (e) =>
    setCoordinates({ ...coords, [e.target.name]: e.target.value });
  const handleParamsChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
    console.log(params);
  };

  const handleSubmit = () => {
    const entries = Object.entries(coords);
    if (entries.every(([_, value]) => value === '')) {
      return onStart({ coords: '', params });
    }

    let errors = [];
    entries.forEach(([coordName, value]) => {
      if (!COORDINATE_RE.test(value)) {
        errors.push(coordName);
      }
    });

    if (errors.length > 0) {
      setErrors(errors);
    } else {
      onStart({ coords, params });
    }
  };

  return (
    <div className={form}>
      <div className="inputForm">
        <Typography>North-East Corner</Typography>
        <InputField
          label="Longitude"
          fieldName="longitudeNE"
          helperText="Invalid coordinate."
          hasError={errors.includes('longitudeNE')}
          handler={handleCoordChange}
        />
        <InputField
          label="Latitude"
          fieldName="latitudeNE"
          helperText="Invalid coordinate."
          hasError={errors.includes('latitudeNE')}
          handler={handleCoordChange}
        />
      </div>
      <div className="inputForm">
        <Typography>South-West Corner</Typography>
        <InputField
          label="Longitude"
          fieldName="longitudeSW"
          helperText="Invalid coordinate."
          hasError={errors.includes('longitudeSW')}
          handler={handleCoordChange}
        />
        <InputField
          label="Latitude"
          fieldName="latitudeSW"
          helperText="Invalid coordinate."
          hasError={errors.includes('latitudeSW')}
          handler={handleCoordChange}
        />
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
