import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import animationData from '../assets/TwitterLottie.json';
import lottie from 'lottie-web';

const useStyles = makeStyles(theme => ({
  logo: {
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: "hidden",
    backgroundColor: theme.palette.background.default,
  },
  logoImg: {
    height: '250px',
    color: '#1da1f2',
  },
  logoTitle: {
    marginLeft: '-20px',
    color: '#1da1f2',
    fontFamily: "Helvetica",
  },
}));

const WelcomingAnimation = () => {
  const { logo, logoImg, logoTitle } = useStyles();
  // Reference to the container on wich the animation is loaded
  const containerRef = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: containerRef.current,
      render: 'svg',
      loop: false,
      autoplay: true,
      animationData,
    });
  }, []);

  return (
    <div id="logo" className={logo}>
      <div id="logoImg" className={logoImg} ref={containerRef} />
      <h1 id="logoTitle" className={logoTitle}>
        TWITTER TRACKER
      </h1>
    </div>
  );
};

export default WelcomingAnimation;
