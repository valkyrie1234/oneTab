import React from "react";
import styles from "./Home.module.css";

type HomeProps = {};

const Home: React.FC<HomeProps> = () => {
  return (
    <div className={styles.HomePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Добро пожаловать в <span className={styles.heroAccent}>OneTab</span>! ⚔️
            </h1>
            <p className={styles.heroSubtitle}>
              Ваш личный трекер квестов и задач. Покоряйте новые горизонты, 
              зарабатывайте награды и следите за своим прогрессом в эпическом путешествии!
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statLabel}>Задач выполнено</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statLabel}>Уровень</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statLabel}>Золота</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.floatingElements}>
              <div className={styles.floatingIcon}>🎯</div>
              <div className={styles.floatingIcon}>⚡</div>
              <div className={styles.floatingIcon}>🏆</div>
              <div className={styles.floatingIcon}>💎</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Возможности QuestTab</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📋</div>
            <h3 className={styles.featureTitle}>Управление задачами</h3>
            <p className={styles.featureDescription}>
              Создавайте, редактируйте и отслеживайте свои квесты с помощью удобного Kanban-интерфейса
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎮</div>
            <h3 className={styles.featureTitle}>Игровая механика</h3>
            <p className={styles.featureDescription}>
              Зарабатывайте опыт, золото и повышайте уровень за выполнение задач
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⏰</div>
            <h3 className={styles.featureTitle}>Система дедлайнов</h3>
            <p className={styles.featureDescription}>
              Устанавливайте сроки выполнения и следите за прогрессом с помощью визуального индикатора
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏅</div>
            <h3 className={styles.featureTitle}>Достижения</h3>
            <p className={styles.featureDescription}>
              Отмечайте победы и поражения с уникальными визуальными эффектами
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.quickActionsSection}>
        <h2 className={styles.sectionTitle}>Быстрые действия</h2>
        <div className={styles.quickActionsGrid}>
          <button className={styles.quickActionButton}>
            <span className={styles.quickActionIcon}>➕</span>
            <span className={styles.quickActionText}>Создать задачу</span>
          </button>
          
          <button className={styles.quickActionButton}>
            <span className={styles.quickActionIcon}>📊</span>
            <span className={styles.quickActionText}>Kanban доски</span>
          </button>
          
          <button className={styles.quickActionButton}>
            <span className={styles.quickActionIcon}>👤</span>
            <span className={styles.quickActionText}>Профиль</span>
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.activitySection}>
        <h2 className={styles.sectionTitle}>Недавняя активность</h2>
        <div className={styles.activityCard}>
          <div className={styles.activityEmpty}>
            <div className={styles.activityEmptyIcon}>📝</div>
            <p className={styles.activityEmptyText}>
              Пока нет активности. Создайте свою первую задачу!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
