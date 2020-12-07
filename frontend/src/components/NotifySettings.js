import React, { useState, useEffect } from 'react';
import { Typography, Slider } from '@material-ui/core';
import axios from 'axios';

import InputField from './InputField';
import { NOTIFICATION } from '../constants';

const NotifySettings = ({ count }) => {
  const [email, setEmail] = useState(undefined);
  const [treshold, setTreshold] = useState(100);

  useEffect(() => {
    if (email && treshold && count >= treshold) {
      axios
        .put(NOTIFICATION, { address: email, count: count })
        .catch((err) => console.log(err));
    }
  }, [email, treshold, count]);

  return (
    <>
      <div className="inputForm">
        <Typography>User</Typography>
        <InputField label="e-mail" handler={(event) => setEmail(event.target.value)} />
        <Typography>{`Already got ${count} tweets`}</Typography>
      </div>
      <div className="inputForm">
        <Typography gutterBottom>Treshold</Typography>
        <Slider
          value={treshold}
          onChange={(_, newT) => setTreshold(newT)}
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
