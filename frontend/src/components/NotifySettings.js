import React, { useState, useEffect } from 'react';
import { Typography, Slider, makeStyles, Divider } from '@material-ui/core';
import axios from 'axios';

import InputField from './InputField';
import { NOTIFICATION } from '../constants';

const useStyles = makeStyles(() => ({
  container: {
    marginBottom: '5vh',
    display: 'flex',
    flexDirection: 'column',
  },
  email: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  counter: {
    marginLeft: '2vh',
    alignItems: 'center',
  },
  threshold: {
    display: 'flex',
    flexDirection: 'row',
  },
  sliderStyle: {
    width: '50%',
    marginLeft: '5vh',
  },
  sliderInput: {
    marginTop: '2vh',
  },
}));

const NotifySettings = ({ count }) => {
  const classes = useStyles();
  const [email, setEmail] = useState(undefined);
  const [treshold, setTreshold] = useState(100);
  const [mailSent, setSent] = useState(false);

  useEffect(() => {
    if (!mailSent && email && treshold && count >= treshold) {
      setSent(true);
      axios
        .put(NOTIFICATION, { address: email, count: count })
        .catch((_) => setSent(false));
    }
  }, [mailSent, email, treshold, count]);

  return (
    <div className={classes.container}>
      <div className={classes.email}>
        <InputField
          label="e-mail"
          handler={(event) => setEmail(event.target.value)}
          disabled={mailSent}
        />
        <Typography
          className={classes.counter}
        >{`Already got ${count} tweets`}</Typography>
      </div>
      <div className={classes.threshold}>
        <Typography gutterBottom>Treshold</Typography>
        <Slider
          className={classes.sliderStyle}
          value={treshold}
          onChange={(_, newT) => setTreshold(newT)}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          disabled={mailSent}
        />
      </div>
      <Divider variant="middle" />
    </div>
  );
};

export default NotifySettings;
