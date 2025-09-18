import React from "react";
import styles from "./Home.module.css";

type HomeProps = {};

const Home: React.FC<HomeProps> = ({}) => {
  return (
    <div className={styles.HomePage}>
        <h1>Welcome to oneTab!</h1>
    </div>
  );
};

export default Home;
