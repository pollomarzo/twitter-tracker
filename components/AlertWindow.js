import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
} from '@material-ui/core';

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

const AlertWindow = ({ isOpen, onConfirm, title, msg }) => {
  const { submitButton, dialog } = useStyles();
  return (
    <Dialog open={isOpen} style={{ display: isOpen || 'none' }}>
      <DialogTitle className={dialog}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{msg}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="default"
          variant="contained"
          className={submitButton}
          onClick={() => onConfirm(false)}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertWindow;