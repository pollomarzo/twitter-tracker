import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/styles";
import MapIcon from '@material-ui/icons/Map';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import lottie from "lottie-web"
import animationData from "../public/TwitterLottie.json"
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';





const useStyles = makeStyles(() => ({
  button: {
    margin: 10,
  },
  textField: {
    margin: 10,
    borderRadius: 10,
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
    margin: 10,
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
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState('idle');

  
  const container = useRef(null)
  const timerRef = useRef();


  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      render: "svg",
      loop: false,
      autoplay: true,
      animationData,
    })

    clearTimeout(timerRef.current);

    setInterval(() => {
      document.getElementById("logo").style.display = 'none';
    }, 4800);

  }, [])

  
  function handleChange(e) {
    const value = e.target.value;
    setCoordinates({
      ...coordinates,
      [e.target.name]: value
    });
  }

  const handleClickQuery = () => {
    clearTimeout(timerRef.current);

    if (query !== 'idle') {
      setQuery('idle');
      //funzione che restituisce i risultati
      return;
    } else {
      axios.post("/api/post/geoFilter", coordinates)
      .then((response) => {console.log(response)})
      .catch((error) => {console.log(error)});
    }

    setQuery('progress');
    timerRef.current = window.setTimeout(() => {
      setQuery('success');
    }, 5000);
  };


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
        <div className={styles.form}>
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
            id="longitudeStart"
            className={classes.textField}
            label="Longitude start"
            variant="outlined"
            name="longitudeStart"
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
          <TextField 
            id="longitudeEnd"
            className={classes.textField}
            label="Longitude end"
            variant="outlined"
            name="longitudeEnd"
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
              {query !== 'idle' ? 'RESET': 'START'}
            </Button>
            <div>
              {query === 'success' ? (
                <Typography>Risultati tweet</Typography>
              ) : (
                <Fade
                  in={query === 'progress'}
                  style={{
                    transitionDelay: query === 'progress' ? '800ms' : '0ms',
                  }}
                  unmountOnExit
                >
                  <CircularProgress />
                </Fade>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

//<img src="/Twitter.png" alt="twitter" className={styles.titleImg}/>
