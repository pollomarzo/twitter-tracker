import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

import { WelcomingAnimation, MainContainer } from '.';

const ANIMATED = process.env.NODE_ENV === 'production';

const Home = () => {
  const IntroAnimation = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: 3300,
    config: { duration: 1000 },
  });

  const MainAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 3700,
    config: { duration: 800 },
  });

  useEffect(() => {
    if (ANIMATED) {
      const timer = setTimeout(() => {
        document.getElementById('logo').style.display = 'none';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
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
    </>
  );
};

export default Home;
