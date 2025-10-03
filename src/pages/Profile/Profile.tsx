import React, { useMemo } from 'react';
import styles from './Profile.module.css';
import useAuthStore from '../../store/storeAuth';
import useTasksStore from '../../store/storeTasks';
import useLevelSystem from '../../hooks/useLevelSystem';
import useReward from '../../hooks/useReward';
import { formatTimeAgo } from '../../helpers/dateHelpers';
import { calculateTaskStats, getRecentActivity } from '../../helpers/taskHelpers';

const Profile: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const tasks = useTasksStore((state) => state.tasks);
  const { setReward, setExp } = useReward();

  // Используем хук для системы уровней
  const levelSystem = useLevelSystem(user?.xp || 0);

  // Вычисляем статистику через хелпер
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  // Последние завершенные/проваленные задачи через хелпер
  const recentActivity = useMemo(() => getRecentActivity(tasks, 5), [tasks]);

  if (!user) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.profileHeader}>
          <h1>Загрузка профиля...</h1>
        </div>
      </div>
    );
  }

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
                <div className={styles.levelBadge}>{levelSystem.level}</div>
              </div>
              <div className={styles.playerInfo}>
                <h2 className={styles.playerName}>{user.username}</h2>
                <p className={styles.playerTitle}>
                  {user.role === 'ADMIN' ? '👑 Администратор' : 
                   user.role === 'MODERATOR' ? '🛡️ Модератор' : 
                   '⚔️ Искатель приключений'}
                </p>
              </div>
            </div>
            
            <div className={styles.levelProgress}>
              <div className={styles.levelInfo}>
                <span>Уровень {levelSystem.level}</span>
                <span>{levelSystem.currentLevelExp.toLocaleString()} / {levelSystem.totalExpToNextLevel.toLocaleString()} EXP</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ 
                  width: `${(levelSystem.currentLevelExp / levelSystem.totalExpToNextLevel) * 100}%` 
                }}></div>
              </div>
            </div>

            <div className={styles.playerStats}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>🏆</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.victories}</span>
                  <span className={styles.statLabel}>Побед</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>💀</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.defeats}</span>
                  <span className={styles.statLabel}>Поражений</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>⚔️</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.total}</span>
                  <span className={styles.statLabel}>Всего квестов</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.resourcesCard}>
            <h3>💰 Ресурсы</h3>
            <div className={styles.resourceItem}>
              <span className={styles.resourceIcon}>{setReward(user.gold)}</span>
              <span className={styles.resourceValue}>{user.gold.toLocaleString()}</span>
              <span className={styles.resourceLabel}>Золото</span>
            </div>
            <div className={styles.resourceItem}>
              <span className={styles.resourceIcon}>{setExp(user.xp)}</span>
              <span className={styles.resourceValue}>{user.xp.toLocaleString()}</span>
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
              {recentActivity.length > 0 ? (
                recentActivity.map((task) => (
                  <div key={task.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      {task.isCompleted ? '✅' : '❌'}
                    </div>
                    <div className={styles.activityInfo}>
                      <span className={styles.activityAction}>
                        {task.isCompleted ? 'Завершен квест' : 'Просрочен квест'}
                      </span>
                      <span className={styles.activityTarget}>"{task.title}"</span>
                      <span className={styles.activityTime}>
                        {formatTimeAgo(task.completedAt || task.updatedAt)}
                      </span>
                    </div>
                    <div className={styles.activityReward}>
                      {task.isCompleted ? `+${task.rewardExp} EXP` : '0 EXP'}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyActivity}>
                  <p>📭 Пока нет завершенных квестов</p>
                  <p className={styles.emptyActivityHint}>Начните выполнять задачи!</p>
                </div>
              )}
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