import React from 'react';
import Head from 'next/head';
import { useSpring, animated } from 'react-spring';
import { WelcomingAnimation, MainContainer } from '../components';

import styles from '../styles/Home.module.css';

const ANIMATED = process.env.NODE_ENV === 'production';

const Home = () => {
  const IntroAnimation = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: 3500,
    config: { duration: 1000 },
  });

  const MainAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 4500,
    config: { duration: 1000 },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Twitter Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {ANIMATED ? (
        <>
          <animated.div style={IntroAnimation}>
            <WelcomingAnimation />
          </animated.div>
          <animated.div style={MainAnimation}>
            <MainContainer />
          </animated.div>
        </>
      ) : (
        <MainContainer />
      )}
    </div>
  );
};

export default Home;
