import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { useErrorHandler } from 'react-error-boundary';

import InputField from './InputField';
import { generateError } from './AlertWindow';

const StartStopStream = ({ stopStream, streamId }) => {
  const [APIparams, setAPIparams] = useState({});
  const propagateError = useErrorHandler();

  const eventHandler = (event) => {
    const { name, value } = event.target;
    setAPIparams({ ...APIparams, [name]: value });
  };

  const startBgStream = () => {
    const { tweetTreshold, dayTreshold } = APIparams;
    if (tweetTreshold <= 1000 && dayTreshold <= 7) {
      // API call here to make it background 
      propagateError(
        generateError(
          `Save this code '${streamId}' in order to recover a session`,
          () => stopStream(),
          'Warning'
        )
      );
    } else {
      propagateError(
        generateError(
          'Please select a day treshold smaller than 7 or a tweet treshold smaller than 1000',
          undefined
        )
      );
    }

    console.log(tweetTreshold, dayTreshold);
  };

  return (
    <>
      <InputField label="Max tweet amount" name="tweetTreshold" onChange={eventHandler} />
      <InputField
        label="Max day of active background streams"
        name="dayTreshold"
        onChange={eventHandler}
      />
      <Button onClick={startBgStream}>Start background stream</Button>
    </>
  );
};

export default StartStopStream;
