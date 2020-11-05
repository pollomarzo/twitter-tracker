import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import {useSpring, animated} from "react-spring" 
import Intro from "./components/intro"
import Main from "./components/main"




export default function Home() {

  const props = useSpring({ from: {opacity: 1}, to: {opacity: 0}, delay: 3500, config: {duration: 1000} })
  const props2 = useSpring({ from: {opacity: 0}, to: {opacity: 1}, delay: 4500, config: {duration: 1000} })

  return (
    <div className={styles.container}>
      <Head>
        <title>Twitter Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <animated.div style={props}>
        <Intro/>
      </animated.div>
      <animated.div style={props2}>
        <Main/>
      </animated.div>
    </div>
  );
}