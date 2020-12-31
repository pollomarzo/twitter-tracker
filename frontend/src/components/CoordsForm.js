import React from 'react';
import { Fade, Button, CircularProgress, makeStyles } from '@material-ui/core';

import { InputField } from '.';

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

const CoordsForm = ({ activeStream, params, onStart, onStop, onParamChange }) => {
  const { submitButton } = useStyles();

  return (
    <>
      <InputField
        label="Hashtag"
        fieldName="track"
        text="#"
        value={params.track}
        handler={onParamChange}
      />
      <InputField
        label="User"
        fieldName="follow"
        text="@"
        value={params.follow}
        handler={onParamChange}
      />
      <Button
        variant="contained"
        color="primary"
        className={submitButton}
        onClick={activeStream ? onStop : onStart}
      >
        {activeStream ? 'STOP' : 'START'}
      </Button>
      <Fade in={activeStream} unmountOnExit>
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
