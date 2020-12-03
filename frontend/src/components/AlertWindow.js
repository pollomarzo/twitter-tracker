import React, { useState } from 'react';
import { makeStyles, Button, Dialog, DialogTitle } from '@material-ui/core';
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { ErrorBoundary } from 'react-error-boundary';

const useStyles = makeStyles({
  dialog: {
    color: '#1DA1F2',
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
});

const AlertWindow = ({error, resetErrorBoundary}) => {
  const { submitButton, dialog } = useStyles();
  const { title, message } = error;
  return (
    <Dialog open={true}>
      <DialogTitle className={dialog}>{title || 'Error'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="default"
          variant="contained"
          className={submitButton}
          onClick={resetErrorBoundary}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const generateError = (message, reset, title) => {
  const error = Error(message);
  const defaultCB = () => {};

  error.title = title || 'Error';
  error.message = message || 'Generic error message';
  error.reset = reset || defaultCB;
  return (error);
};


const ErrorCatcher = ({ children }) => {
  const [error, setError] = useState(undefined);
  const handleReset = () => {
    error.reset();
    setError(undefined);
  }

  return (
    <ErrorBoundary
      FallbackComponent={AlertWindow}
      onError={err => setError(err)}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
};


export { generateError, AlertWindow };
export default ErrorCatcher;