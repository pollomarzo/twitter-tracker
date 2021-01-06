import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

import { WelcomingAnimation, MainContainer } from '.';

const ANIMATED = process.env.NODE_ENV === 'production';

const Home = () => {
  const IntroAnimation = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: 4000,
    config: { duration: 500 },
  });

  const MainAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 4500,
    config: { duration: 1000 },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("logo").style.display = "none"; 
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {ANIMATED ? (
        <>
          <animated.div style={IntroAnimation}>
            <WelcomingAnimation/>
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
