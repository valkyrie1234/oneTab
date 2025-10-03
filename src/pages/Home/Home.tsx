import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import useAuthStore from "../../store/storeAuth";
import useTasksStore from "../../store/storeTasks";
import useLevelSystem from "../../hooks/useLevelSystem";
import { calculateTaskStats } from "../../helpers/taskHelpers";

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const tasks = useTasksStore((state) => state.tasks);
  const navigate = useNavigate();
  
  // Если авторизован - показываем статистику
  const levelSystem = useLevelSystem(user?.xp || 0);
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  return (
    <div className={styles.HomePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              {isAuthenticated && user 
                ? `Добро пожаловать, ${user.username}!` 
                : 'Добро пожаловать в OneTab!'
              } ⚔️
            </h1>
            <p className={styles.heroSubtitle}>
              {isAuthenticated 
                ? 'Готовы к новым приключениям? Ваши квесты ждут!' 
                : 'Ваш личный трекер квестов и задач. Покоряйте новые горизонты, зарабатывайте награды и следите за своим прогрессом в эпическом путешествии!'
              }
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {isAuthenticated ? stats.victories : 0}
                </span>
                <span className={styles.statLabel}>Задач выполнено</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {isAuthenticated ? levelSystem.level : 0}
                </span>
                <span className={styles.statLabel}>Уровень</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {isAuthenticated && user ? user.gold : 0}
                </span>
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

      {/* Quick Actions - только для авторизованных */}
      {isAuthenticated && (
        <section className={styles.quickActionsSection}>
          <h2 className={styles.sectionTitle}>Быстрые действия</h2>
          <div className={styles.quickActionsGrid}>
            <button 
              className={styles.quickActionButton}
              onClick={() => navigate('/create')}
            >
              <span className={styles.quickActionIcon}>➕</span>
              <span className={styles.quickActionText}>Создать задачу</span>
            </button>
            
            <button 
              className={styles.quickActionButton}
              onClick={() => navigate('/kanban')}
            >
              <span className={styles.quickActionIcon}>📊</span>
              <span className={styles.quickActionText}>Kanban доски</span>
            </button>
            
            <button 
              className={styles.quickActionButton}
              onClick={() => navigate('/profile')}
            >
              <span className={styles.quickActionIcon}>👤</span>
              <span className={styles.quickActionText}>Профиль</span>
            </button>
          </div>
        </section>
      )}

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
