import styles from "../../styles/Home.module.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import axios from "axios";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { NoSsr } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  button: {
    margin: 10,
  },
  textField: {
    margin: 10,
    width: 300,
    [`& fieldset`]: {
      borderWidth: 2,
      borderRadius: 25,
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1DA1F2",
    },
    "& .MuiOutlinedInput-input": {
      color: "#1DA1F2",
    },
    "& .MuiInputLabel-outlined": {
      color: "#1DA1F2",
    },
  },
  submitButton: {
    margin: 10,
    width: 100,
    fontWeight: 800,
    color: "white",
    backgroundColor: "#1DA1F2",
    "&:hover": {
      backgroundColor: "lightblue",
      color: "#1DA1F2",
   }
  },
  dialog: {
    color: "#1DA1F2", 
  }
}));


export default function Main() {
  const classes = useStyles();

  const [coordinates, setCoordinates] = useState({                    //object with 4 coordinates inputs
    latitudeStart: 0,
    longitudeStart: 0,
    latitudeEnd: 0,
    longitudeEnd: 0,
  });
  const [loading, setLoading] = useState(false);                      //to change button semantic
  const [id, setId] = useState(0);                              //to send id of axios/post to axios/delete
  const [open, setOpen] = useState(false);


  function handleChange(e) {
    const value = e.target.value;
    setCoordinates({...coordinates, [e.target.name]: value });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickQuery = () => {
    if (loading) {
      setLoading(prev => !prev);
      axios
      .delete("/api/geoFilter", {
          data: { id: id },
          headers: { "Authorization": "***" }
      })
      .then((response) => {
          console.log(response)
          var dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(response.data))}`
          var dlAnchorElem = document.getElementById("downloadAnchorElem");
          dlAnchorElem.setAttribute("href", dataStr);
          dlAnchorElem.setAttribute("download", `${id}.json`);
          dlAnchorElem.click();
      })
      .catch((error) => console.log("Error message: ", error.message));
    } else {
      var correctInput = true;
      const regex = RegExp("^-?[1]?[0-8]?[0-9][.][0-9]{2}$");
      const input = [coordinates.longitudeStart, coordinates.latitudeStart, coordinates.longitudeEnd, coordinates.latitudeEnd]
      input.forEach((element) =>{
          if (!(regex.test(element))) correctInput = false
      })
      if (correctInput){
        setLoading(prev => !prev);
        axios
        .post("/api/geoFilter", {
        coordinates: `${coordinates.longitudeStart},${coordinates.latitudeStart},${coordinates.longitudeEnd},${coordinates.latitudeEnd}`
        })
        .then((response) => {
        setId(response.data);
        })
        .catch((error) => {
        console.log(error);
        });
      } else {
        handleClickOpen()
      }
    }
  };

  const aStyle = {display: "none"};

  return (
    <NoSsr>
      <div className={styles.main}>
          <header className={styles.title}>
              <h1 className={styles.titleH1}>TWITTER TRACKER</h1>
          </header>
          <a href="" id="downloadAnchorElem" style={aStyle}></a>
          <div className={styles.form}>
              <TextField
                  id="longitudeStart"
                  className={classes.textField}
                  label="Longitude start"
                  variant="outlined"
                  name="longitudeStart"
                  required
                  onChange={handleChange}
              />
              <TextField
                  id="latitudeStart"
                  className={classes.textField}
                  label="Latitude start"
                  variant="outlined"
                  name="latitudeStart"
                  required
                  onChange={handleChange}
              />
              <TextField
                  id="longitudeEnd"
                  className={classes.textField}
                  label="Longitude end"
                  variant="outlined"
                  name="longitudeEnd"
                  required
                  onChange={handleChange}
              />
              <TextField
                  id="latitudeEnd"
                  className={classes.textField}
                  label="Latitude end"
                  variant="outlined"
                  name="latitudeEnd"
                  required
                  onChange={handleChange}
              />
              <div className={styles.submit}>
                  <Button
                      onClick={handleClickQuery}
                      variant="contained"
                      className={classes.submitButton}
                      color="default"
                      >
                      {loading ? "STOP" : "START"}
                  </Button>
                  <div>
                      <Fade
                          in={loading}
                          unmountOnExit
                      >
                          <CircularProgress />
                      </Fade>
                  </div>
              </div>
              <AlertWindow value={open} function={handleClose}/>
          </div>
      </div>
    </NoSsr>
  );
}




function AlertWindow(props) {
  const classes = useStyles();
  
  return(
    <Dialog
    open={props.value}
    onClose={props.function}
    >
    <DialogTitle id="alert-dialog-title" className={classes.dialog}>Bad input</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        An acceptable input is a number in range [-180.00, 180.00] written with this formula
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.function} variant="contained" className={classes.submitButton} color="default" autoFocus>
        OK
      </Button>
    </DialogActions>
    </Dialog>
  )
}