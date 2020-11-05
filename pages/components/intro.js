import styles from "../../styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../../public/TwitterLottie.json";


export default function Intro() {

    const container = useRef(null);                                     //about intro img

    useEffect(() => {
      lottie.loadAnimation({
        container: container.current,
        render: "svg",
        loop: false,
        autoplay: true,
        animationData,
      });
    }, []);

    return (
      <div id="logo" className={styles.logo}>
            <div id="logoImg"className={styles.logoImg} ref={container} />
            <h1 id="logoTitle" className={styles.logoTitle}>TWITTER TRACKER</h1>
      </div>
    )
}