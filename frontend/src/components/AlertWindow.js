import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

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
    <Dialog open={isOpen}>
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
