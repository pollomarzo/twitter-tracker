import React, { useState } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Fab, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  fabIcon: {
    marginLeft: 30,
    marginRight: 30,
  },
  childrenContainer: {
    height: 'auto',
  }
}));

const ShowDialogIcon = ({ icon, iconOnly, name, desc, children }) => {
  const [isOpen, setOpen] = useState(false);
  const { fabIcon, childrenContainer} = useStyles();

  return (
    <>
      <Fab
        className={fabIcon}
        variant={iconOnly ? 'round' : 'extended'}
        onClick={() => setOpen((prev) => !prev)}
      >
        {icon}
        {iconOnly || name}
      </Fab>
      <Dialog open={isOpen} onClose={() => setOpen(false)} maxWidth="md">
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <DialogContentText>{desc}</DialogContentText>
          <Grid container className={childrenContainer} justify="space-evenly">
            {children}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowDialogIcon;
