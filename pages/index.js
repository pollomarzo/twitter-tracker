import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MapIcon from '@material-ui/icons/Map';
import React, { useState } from 'react';
import axios from 'axios';




const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  textField: {
    margin: theme.spacing(1),
    width: "50%",
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1DA1F2"
    },
    "& .MuiOutlinedInput-input": {
      color: "#1DA1F2"
    },
    "& .MuiInputLabel-outlined": {
      color: "#1DA1F2"
    },
  },
  submitButton: {
    margin: theme.spacing(1),
    width: 100,
    color: "white",
    backgroundColor: "#1DA1F2"
  }
}));




export default function Home() {
  const classes = useStyles();
  const [coordinates, setCoordinates] = useState({
    latitudeStart: 0,
    longitudeStart: 0,
    latitudeEnd: 0,
    longitudeEnd: 0,
  })

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(coordinates)
    axios.post("/api/post/geoFilter", coordinates)
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

  function handleChange(evt) {
    const value = evt.target.value;
    setCoordinates({
      ...coordinates,
      [evt.target.name]: value
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Twitter Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header className={styles.title}>
          <img src="/Twitter.png" alt="twitter" className={styles.titleImg}/>
          <h1 className={styles.titleH1}>Twitter Tracker</h1>
        </header>   
        <form className={styles.form} onSubmit={handleOnSubmit}>
          <TextField 
            id="latitudeStart"
            className={classes.textField}
            label="Latitude start"
            type="number" 
            variant="outlined"
            name="latitudeStart"
            onChange={handleChange}
          />
          <TextField 
            id="longitudeStart"
            className={classes.textField}
            label="Longitude start"
            type="number" 
            variant="outlined"
            name="longitudeStart"
            onChange={handleChange}
          />
          <TextField 
            id="latitudeEnd"
            className={classes.textField}
            label="Latitude end"
            type="number" 
            variant="outlined"
            name="latitudeEnd"
            onChange={handleChange}
          />
          <TextField 
            id="longitudeEnd"
            className={classes.textField}
            label="Longitude end"
            type="number" 
            variant="outlined"
            name="longitudeEnd"
            onChange={handleChange}
          />
          <Button
            variant="contained"
            className={classes.submitButton}
            color="default"
            type="submit"
            startIcon={<MapIcon />}
          >
           SEND
          </Button>
        </form>
      </main>
    </div>
  )
}
