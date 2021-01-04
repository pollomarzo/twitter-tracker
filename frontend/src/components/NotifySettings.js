import React, { useState, useEffect } from 'react';
import { Typography, Slider, Grid, makeStyles } from '@material-ui/core';
import axios from 'axios';

import { InputField } from './InputComponent';
import { NOTIFICATION } from '../constants';

const useStyles = makeStyles((theme) => ({
  tresholdSlider: {
    width: 70,
  },
}));

const NotifySettings = ({ count }) => {
  const { tresholdSlider } = useStyles();
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
    <>
      <Grid item xs={4}>
        <InputField
          label="e-mail"
          handler={(event) => setEmail(event.target.value)}
          disabled={mailSent}
        />
      </Grid>
      <Grid item xs={4}>
        <Typography gutterBottom>Treshold</Typography>
        <Slider
          classNames={tresholdSlider}
          value={treshold}
          onChange={(_, newT) => setTreshold(newT)}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          disabled={mailSent}
        />
      </Grid>
    </>
  );
};

export default NotifySettings;
