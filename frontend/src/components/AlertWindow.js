import React, { useState } from 'react';
import { makeStyles, Button, Dialog, DialogTitle } from '@material-ui/core';
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

import { ErrorBoundary } from 'react-error-boundary';

const useStyles = makeStyles(theme => ({
  dialog: {
    color: theme.palette.primary.main,
  },
  
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


const UserError = (message, reset, title) => {
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


export { UserError, AlertWindow };
export default ErrorCatcher;