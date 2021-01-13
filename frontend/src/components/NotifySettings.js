import React, { useState, useCallback } from 'react';
import { Typography, Slider, Grid, Button, makeStyles } from '@material-ui/core';
import axios from 'axios';

import { InputField } from './InputComponent';
import { NOTIFICATION } from '../constants';

const useStyles = makeStyles((theme) => ({
  tresholdSlider: {
    width: 70,
  },
  submitButton: {
    margin: 20,
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

const NotifySettings = ({ streamId }) => {
  const { tresholdSlider, submitButton } = useStyles();
  const [email, setEmail] = useState(undefined);
  const [treshold, setTreshold] = useState(100);
  // const [mailSent, setSent] = useState(false);

  // useEffect(() => {
  //   if (!mailSent && email && count >= treshold) {
  //     setSent(true);
  //     axios
  //       .put(NOTIFICATION, { address: email, count: count })
  //       .catch((_) => setSent(false));
  //   }
  // }, [mailSent, email, count, treshold]);

  const confirm = useCallback(async () => {
    try {
      await axios.put(NOTIFICATION, { streamId, email, treshold });
    } catch (err) {
      console.error(err);
    }
  }, [streamId, email, treshold]);

  return (
    <>
      <Grid item xs={4}>
        <InputField label="e-mail" handler={(event) => setEmail(event.target.value)} />
      </Grid>
      <Grid item xs={4}>
        <Typography gutterBottom>Treshold</Typography>
        <Slider
          className={tresholdSlider}
          value={treshold}
          onChange={(_, newT) => setTreshold(newT)}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
        />
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="contained"
          color="primary"
          className={submitButton}
          onClick={confirm}
        >
          Confirm
        </Button>
      </Grid>
    </>
  );
};

export default NotifySettings;
