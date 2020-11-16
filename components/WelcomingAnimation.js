import React, { useEffect, useRef } from "react";
import animationData from "../public/TwitterLottie.json";
import lottie from "lottie-web";

import styles from "../styles/Home.module.css";


const WelcomingAnimation = () => {
  // Reference to the container on wich the animation is loaded
  const containerRef = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: containerRef.current,
      render: "svg",
      loop: false,
      autoplay: true,
      animationData,
    });
  }, []);

  return (
    <div id="logo" className={styles.logo}>
      <div id="logoImg"className={styles.logoImg} ref={containerRef} />
      <h1 id="logoTitle" className={styles.logoTitle}>TWITTER TRACKER</h1>
    </div>
  );
}

export default WelcomingAnimation;