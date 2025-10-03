import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/storeAuth";
import styles from "./Moderator.module.css";

const Moderator = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🛡️ ПАНЕЛЬ МОДЕРАТОРА</h1>
        <p className={styles.subtitle}>Управление контентом и задачами</p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoText}>
          <h2>⚔️ Добро пожаловать, {user?.username}!</h2>
          
          <div className={styles.badge}>РОЛЬ: MODERATOR</div>
          <div className={styles.badge}>Уровень: {user?.level}</div>
          <div className={styles.badge}>💰 {user?.gold} Gold</div>
          <div className={styles.badge}>⭐ {user?.xp} XP</div>

          <p style={{ marginTop: '40px', fontSize: '18px' }}>
            🔐 Это защищенная страница доступная для <strong>MODERATOR</strong> и <strong>ADMIN</strong>
          </p>

          <p style={{ marginTop: '20px', color: 'var(--color-text-300)' }}>
            Здесь будет панель модерации:<br/><br/>
            • Управление задачами пользователей<br/>
            • Модерация контента<br/>
            • Просмотр отчетов<br/>
            • Помощь пользователям<br/>
          </p>

          <button className={styles.logoutButton} onClick={handleLogout}>
            🚪 ВЫХОД
          </button>
        </div>
      </div>
    </div>
  );
};

export default Moderator;

