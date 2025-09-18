import React from 'react';
import styles from './Profile.module.css';

type ProfileProps = {};

const Profile: React.FC<ProfileProps> = ({}) => {
  return (
    <div className={styles.profilePage}>
      {/* Заголовок профиля */}
      <div className={styles.profileHeader}>
        <div className={styles.profileTitle}>
          <h1>🏰 Таверна Искателя</h1>
          <p className={styles.profileSubtitle}>Ваш рыцарский профиль</p>
        </div>
        <div className={styles.profileDecoration}>
          <div className={styles.decorationIcon}>⚔️</div>
        </div>
      </div>

      {/* Основной контент профиля */}
      <div className={styles.profileContent}>
        {/* Левая колонка - Статистика игрока */}
        <div className={styles.profileLeftColumn}>
          <div className={styles.playerCard}>
            <div className={styles.playerHeader}>
              <div className={styles.avatarContainer}>
                <div className={styles.playerAvatar}>🛡️</div>
                <div className={styles.levelBadge}>15</div>
              </div>
              <div className={styles.playerInfo}>
                <h2 className={styles.playerName}>Рыцарь Дракона</h2>
                <p className={styles.playerTitle}>Мастер Квестов</p>
              </div>
            </div>
            
            <div className={styles.levelProgress}>
              <div className={styles.levelInfo}>
                <span>Уровень 15</span>
                <span>1,250 / 2,000 EXP</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '62.5%' }}></div>
              </div>
            </div>

            <div className={styles.playerStats}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>🏆</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>47</span>
                  <span className={styles.statLabel}>Побед</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>💀</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>12</span>
                  <span className={styles.statLabel}>Поражений</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>⚔️</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>59</span>
                  <span className={styles.statLabel}>Всего квестов</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.resourcesCard}>
            <h3>💰 Ресурсы</h3>
            <div className={styles.resourceItem}>
              <span className={styles.resourceIcon}>🪙</span>
              <span className={styles.resourceValue}>12,450</span>
              <span className={styles.resourceLabel}>Золото</span>
            </div>
            <div className={styles.resourceItem}>
              <span className={styles.resourceIcon}>💎</span>
              <span className={styles.resourceValue}>8,750</span>
              <span className={styles.resourceLabel}>Опыт</span>
            </div>
          </div>
        </div>

        {/* Правая колонка - Достижения и история */}
        <div className={styles.profileRightColumn}>
          <div className={styles.achievementsCard}>
            <h3>🏅 Достижения</h3>
            <div className={styles.achievementsGrid}>
              <div className={`${styles.achievementItem} ${styles.earned}`}>
                <div className={styles.achievementIcon}>🥇</div>
                <div className={styles.achievementInfo}>
                  <span className={styles.achievementName}>Первые шаги</span>
                  <span className={styles.achievementDesc}>Завершите первый квест</span>
                </div>
              </div>
              <div className={`${styles.achievementItem} ${styles.earned}`}>
                <div className={styles.achievementIcon}>🔥</div>
                <div className={styles.achievementInfo}>
                  <span className={styles.achievementName}>Серия побед</span>
                  <span className={styles.achievementDesc}>10 побед подряд</span>
                </div>
              </div>
              <div className={`${styles.achievementItem} ${styles.locked}`}>
                <div className={styles.achievementIcon}>👑</div>
                <div className={styles.achievementInfo}>
                  <span className={styles.achievementName}>Король квестов</span>
                  <span className={styles.achievementDesc}>100 побед</span>
                </div>
              </div>
              <div className={`${styles.achievementItem} ${styles.earned}`}>
                <div className={styles.achievementIcon}>⚡</div>
                <div className={styles.achievementInfo}>
                  <span className={styles.achievementName}>Скоростной</span>
                  <span className={styles.achievementDesc}>Завершите квест за 1 час</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.recentActivityCard}>
            <h3>📜 Последняя активность</h3>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>✅</div>
                <div className={styles.activityInfo}>
                  <span className={styles.activityAction}>Завершен квест</span>
                  <span className={styles.activityTarget}>"Спасти принцессу"</span>
                  <span className={styles.activityTime}>2 часа назад</span>
                </div>
                <div className={styles.activityReward}>+500 EXP</div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>❌</div>
                <div className={styles.activityInfo}>
                  <span className={styles.activityAction}>Просрочен квест</span>
                  <span className={styles.activityTarget}>"Победить дракона"</span>
                  <span className={styles.activityTime}>1 день назад</span>
                </div>
                <div className={styles.activityReward}>-0 EXP</div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>✅</div>
                <div className={styles.activityInfo}>
                  <span className={styles.activityAction}>Завершен квест</span>
                  <span className={styles.activityTarget}>"Найти сокровище"</span>
                  <span className={styles.activityTime}>3 дня назад</span>
                </div>
                <div className={styles.activityReward}>+300 EXP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className={styles.profileDecorations}>
        <div className={styles.decorationTopLeft}>🌳</div>
        <div className={styles.decorationTopRight}>🏰</div>
        <div className={styles.decorationBottomLeft}>🗡️</div>
        <div className={styles.decorationBottomRight}>🛡️</div>
      </div>
    </div>
  );
};
   
export default Profile;