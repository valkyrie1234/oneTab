import React from "react";
import styles from "./RewardBar.module.css";
import useReward from "../../hooks/useReward";

type RewardBarProps = {
    gold: number;
    exp: number;
};

const RewardBar: React.FC<RewardBarProps> = ({gold, exp}) => {
  const { setExp, setReward } = useReward();

  return (
    <div className={styles.rewardBar}>
      <p className={styles.goldReward}>gold: {gold}{setReward(gold)}</p>
      <p className={styles.expReward}>ex: {exp}{setExp(exp)}</p>
    </div>
  );
};

export default RewardBar;
