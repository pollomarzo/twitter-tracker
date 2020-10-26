import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MapIcon from '@material-ui/icons/Map';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import lottie from "lottie-web"
import animationData from "../public/TwitterLottie.json"
import anime from "animejs"


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

  function handleChange(e) {
    const value = e.target.value;
    setCoordinates({
      ...coordinates,
      [e.target.name]: value
    });
  }

  const container = useRef(null)

  const onAnimationFinish = () => {
    console.log('animation finished detected with isCancelled: ' + isCancelled);
  };

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      render: "svg",
      loop: false,
      autoplay: true,
      animationData,
      onAnimationFinish: {onAnimationFinish}
    })

    setInterval(() => {
      document.getElementById("logo").style.display = 'none';
    }, 4800);

  }, [])



  return (
    <div className={styles.container}>
      <Head>
        <title>Twitter Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="logo" className={styles.intro}>
        <div className={styles.introLogo} ref={container}/>
        <h1 className={styles.introTitle}>TWITTER TRACKER</h1>
      </div>
      <main className={styles.main}>
        <header className={styles.title}>
          <h1 className={styles.titleH1}>TWITTER TRACKER</h1>
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

//<img src="/Twitter.png" alt="twitter" className={styles.titleImg}/>
