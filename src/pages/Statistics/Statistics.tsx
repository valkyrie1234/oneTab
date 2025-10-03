import React from 'react';
import styles from './Statistics.module.css';

const Statistics: React.FC = () => {
  return (
    <div className={styles.statisticsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📊 Статистика системы</h1>
        <p className={styles.pageSubtitle}>Общая аналитика и метрики проекта OneTab</p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>📈</div>
          <h2>Админ панель - Статистика</h2>
          <p className={styles.infoText}>
            Здесь будет отображаться полная статистика системы:
          </p>
          <ul className={styles.featureList}>
            <li>👥 Общее количество пользователей</li>
            <li>📋 Всего создано задач в системе</li>
            <li>🏆 Процент завершенных задач</li>
            <li>💀 Процент проваленных задач</li>
            <li>📈 График активности пользователей</li>
            <li>⏱️ Среднее время выполнения задач</li>
            <li>🎯 Популярные уровни сложности</li>
            <li>💰 Статистика наград и опыта</li>
            <li>📅 Ежедневная/недельная/месячная активность</li>
            <li>🔝 Топ пользователей по уровню</li>
            <li>🌟 Самые активные пользователи</li>
          </ul>
          <div className={styles.comingSoon}>
            🚧 В разработке...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

