import React, { useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Fade,
  Button,
  makeStyles,
  TextField,
  NoSsr,
} from "@material-ui/core";
import { AlertWindow } from "./";

import styles from "../../styles/Home.module.css";

const useStyles = makeStyles(() => ({
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
    },
  },
}));

const MainContainer = () => {
  const { textField, submitButton } = useStyles();
  // To set the id of the current stream
  const [streamId, setStreamId] = useState(undefined);
  const [error, setError] = useState(false);

  // A set of coords to initialize a geolocalized stream
  const [coords, setCoordinates] = useState({
    latitudeStart: 0,
    latitudeEnd: 0,
    longitudeStart: 0,
    longitudeEnd: 0,
  });

  const handleChange = (e) =>
    setCoordinates({ ...coords, [e.target.name]: e.target.value });

  const openStream = () => {
    // A stream is already opened, error!
    if (streamId !== undefined) return;

    let correctInput = true;
    const correctFormatRegEx = RegExp("^-?[1]?[0-8]?[0-9][.][0-9]{2}$");
    // Check if the params are correct
    Object.values(coords).forEach(
      (value) => (correctInput = correctInput && correctFormatRegEx.test(value))
    );

    if (correctInput) {
      axios
        .post("/api/geoFilter", {
          coordinates: `${coords.longitudeStart},${coords.latitudeStart},${coords.longitudeEnd},${coords.latitudeEnd}`,
        })
        .then((res) => setStreamId(res.data))
        .catch((err) => console.log(err));
    } else setError(true);
  };

  const closeStream = () => {
    // A stram wasn't opened before, error!
    if (streamId === undefined) return;

    axios
      .delete("/api/geoFilter", {
        data: { id: streamId },
        headers: { Authorization: "***" },
      })
      .then((_) => setStreamId(undefined))
      .catch((err) => console.warn(err));
  };

  return (
    <NoSsr>
      <div className={styles.main}>
        <header className={styles.title}>
          <h1 className={styles.titleH1}>TWITTER TRACKER</h1>
        </header>

        <div className={styles.form}>
          {/* ToDo Refractor this part */}
          <TextField
            id="longitudeStart"
            className={textField}
            label="Longitude start"
            variant="outlined"
            name="longitudeStart"
            required
            onChange={handleChange}
          />
          <TextField
            id="latitudeStart"
            className={textField}
            label="Latitude start"
            variant="outlined"
            name="latitudeStart"
            required
            onChange={handleChange}
          />
          <TextField
            id="longitudeEnd"
            className={textField}
            label="Longitude end"
            variant="outlined"
            name="longitudeEnd"
            required
            onChange={handleChange}
          />
          <TextField
            id="latitudeEnd"
            className={textField}
            label="Latitude end"
            variant="outlined"
            name="latitudeEnd"
            required
            onChange={handleChange}
          />

          <div className={styles.submit}>
            <Button
              onClick={streamId ? closeStream : openStream}
              variant="contained"
              className={submitButton}
              color="default"
            >
              {streamId ? "STOP" : "START"}
            </Button>
            <div>
              <Fade in={streamId !== undefined} unmountOnExit>
                <CircularProgress />
              </Fade>
            </div>
          </div>

          <AlertWindow
            isOpen={error}
            onConfirm={setError}
            title="Error"
            msg="An acceptable input is a number in range [-180.00, 180.00] written with this formula"
          />
        </div>
      </div>
    </NoSsr>
  );
};

export default MainContainer;
