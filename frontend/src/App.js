import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useSpring, animated } from 'react-spring';
import WelcomingAnimation from './components/WelcomingAnimation';
import MainContainer from './components/MainContainer';

const ANIMATED = process.env.NODE_ENV === 'production';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgb(229, 242, 248)',
  },
});

const App = () => {
  const { container } = useStyles();

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
    <div className={container}>
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

export default App;
