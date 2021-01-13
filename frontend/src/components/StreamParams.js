import React from 'react';
import { Button, CircularProgress, makeStyles } from '@material-ui/core';

import { InputField } from './InputComponent';

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
    '&:.MuiButton-text': {
      marginLeft: 70,
    },
  },
}));

const StreamParams = ({ activeStream, params, onStart, onStop, onParamChange }) => {
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
        startIcon={activeStream ? <CircularProgress size={20} /> : undefined}
      >
        {activeStream ? 'STOP ' : 'START'}
      </Button>
    </>
  );
};

export default StreamParams;
/* 
  ToDo here there are still some cleanings to be done
  There's a strange issue with autocompleton in the input form
*/
