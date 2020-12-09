import React, { useState, useEffect } from 'react';
import { Typography, Slider } from '@material-ui/core';
import axios from 'axios';

import InputField from './InputField';
import { NOTIFICATION } from '../constants';

const NotifySettings = ({ count }) => {
  const [email, setEmail] = useState(undefined);
  const [treshold, setTreshold] = useState(100);
  const [mailSent, setSent] = useState(false);

  useEffect(() => {
    if (!mailSent && email && treshold && count >= treshold) {
      setSent(true);
      axios
        .put(NOTIFICATION, { address: email, count: count })
        .catch((err) => console.log(err));
    }
  }, [mailSent, email, treshold, count]);

  return (
    <>
      <div className="inputForm">
        <InputField label="e-mail" handler={(event) => setEmail(event.target.value)} />
        <Typography>{`Already got ${count} tweets`}</Typography>
      </div>
      <div className="inputForm">
        <Typography gutterBottom>Treshold</Typography>
        <Slider
          value={treshold}
          onChange={(_, newT) => {
            setTreshold(newT)
            setSent(false);
          }}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={50}
          marks
        />
      </div>
    </>
  );
};

export default NotifySettings;
