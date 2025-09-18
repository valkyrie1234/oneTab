import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';
import Button from '../../uiKit/Button/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.notFoundPage}>
      <div className={styles.notFoundContainer}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.errorTitle}>Страница не найдена</h1>
        <p className={styles.errorDescription}>
          Упс! Похоже, эта страница потерялась в древесных дебрях нашего приложения.
        </p>
        <div className={styles.errorActions}>
          <Button 
            onClick={handleGoHome}
            className={styles.homeButton}
          >
            🏠 Вернуться домой
          </Button>
        </div>
        <div className={styles.decorativeElements}>
          <div className={styles.woodPattern}>🌳</div>
          <div className={styles.woodPattern}>🍂</div>
          <div className={styles.woodPattern}>🪵</div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

