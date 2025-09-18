import React from "react";
import styles from "./Badge.module.css";
import useSetStatusSmile from "../../hooks/useSetStatusSmile";
import { DifficultyStatus } from "../../Consts/status";
import classNames from "classnames";

interface BadgeProps {
  status: DifficultyStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const { setStatusSmile } = useSetStatusSmile();

  return (
    <div
      className={classNames([
        styles.badge,
        {
          [styles.easy]: status === "easy",
          [styles.medium]: status === "medium",
          [styles.hard]: status === "hard",
          [styles.epic]: status === "epic",
          [styles.completed]: status === "completed",
        },
      ])}
    >
      {setStatusSmile(status)}
    </div>
  );
};

export default Badge;
