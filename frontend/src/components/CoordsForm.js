import React, { useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { Fade, Button, Typography } from '@material-ui/core';
import { CircularProgress, makeStyles } from '@material-ui/core';

import { generateError } from './AlertWindow';
import InputField from './InputField';

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

const CoordsForm = ({
  open,
  coords,
  params,
  onStart,
  onStop,
  onCoordChange,
  onParamChange,
}) => {
  const { form, submitContainer, submitButton } = useStyles();
  return (
    <div className={form}>
      <div className="inputForm">
        <Typography>North-East Corner</Typography>
        <InputField
          value={coords.longitudeNE}
          label="Longitude"
          fieldName="longitudeNE"
          handler={onCoordChange}
        />
        <InputField
          value={coords.latitudeNE}
          label="Latitude"
          fieldName="latitudeNE"
          handler={onCoordChange}
        />
      </div>
      <div className="inputForm">
        <Typography>South-West Corner</Typography>
        <InputField
          value={coords.longitudeSW}
          label="Longitude"
          fieldName="longitudeSW"
          handler={onCoordChange}
        />
        <InputField
          value={coords.latitudeSW}
          label="Latitude"
          fieldName="latitudeSW"
          handler={onCoordChange}
        />
      </div>
      <div className="inputForm">
        <Typography>Hashtag</Typography>
        <InputField
          value={params.track}
          fieldName="track"
          text="#"
          handler={onParamChange}
        />
      </div>
      <div className="inputForm">
        <Typography>User</Typography>
        <InputField
          value={params.follow}
          fieldName="follow"
          text="@"
          handler={onParamChange}
        />
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
            onClick={onStart}
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
