import React from "react";
import styles from "./ProgressBar.module.css";
import useTaskExpiry from "../../hooks/useTaskExpiry";

interface ProgressBarProps {
  expiredDate: Date | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ expiredDate }) => {
  const expiryInfo = useTaskExpiry(expiredDate);

  // Если нет даты окончания, не показываем бар (задача не может просрочиться)
  if (!expiredDate || !expiryInfo) {
    return null;
  }

  // Вычисляем процент прогресса
  let progressPercentage: number;
  
  if (expiryInfo.isExpired) {
    // Если время истекло - показываем 100% (полный бар)
    progressPercentage = 100;
  } else {
    // Если время есть - показываем процент оставшегося времени
    // Берем максимум 7 дней как 100%
    const maxDays = 7;
    const maxTime = maxDays * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах
    progressPercentage = Math.max(0, Math.min(100, (expiryInfo.timeLeft / maxTime) * 100));
  }

  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.startIcon}>🛡️</div>
      <div className={styles.progressTrack}>
        <div 
          className={`${styles.progressFill} ${expiryInfo.isExpired ? styles.expired : styles.active}`}
          style={{ width: `${progressPercentage}%` }}
        />
        <div className={styles.progressPercentage}>
          {Math.round(progressPercentage)}%
        </div>
      </div>
      <div className={styles.endIcon}>💀</div>
    </div>
  );
};

export default ProgressBar;
