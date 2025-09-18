import React from "react";
import styles from "./DateBadge.module.css";
import { formatDateTime } from "../../helpers/dateHelpers";

interface DateBadgeProps {
  date: Date;
}

const DateBadge: React.FC<DateBadgeProps> = ({ date }) => {
  return (
    <div className={styles.dateBadge}>
      <span className={styles.calendarIcon}>📅</span>
      <span className={styles.dateText}>{formatDateTime(date)}</span>
    </div>
  );
};

export default DateBadge;
