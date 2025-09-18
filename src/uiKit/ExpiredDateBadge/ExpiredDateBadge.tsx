import React from "react";
import styles from "./ExpiredDateBadge.module.css";
import { formatExpiredDate } from "../../helpers/dateHelpers";

interface ExpiredDateBadgeProps {
  expiredDate: Date | null;
}

const ExpiredDateBadge: React.FC<ExpiredDateBadgeProps> = ({ expiredDate }) => {
  return (
    <div className={styles.expiredBadge}>
      <span className={styles.skullIcon}>💀</span>
      <span className={styles.expiredText}>{formatExpiredDate(expiredDate)}</span>
    </div>
  );
};

export default ExpiredDateBadge;
