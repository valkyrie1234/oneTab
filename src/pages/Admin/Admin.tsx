import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/storeAuth";
import styles from "./Admin.module.css";

const Admin = () => {
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
        <h1 className={styles.title}>👑 ПАНЕЛЬ АДМИНИСТРАТОРА</h1>
        <p className={styles.subtitle}>Полный контроль над системой</p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoText}>
          <h2>🎮 Добро пожаловать, {user?.username}!</h2>
          
          <div className={styles.badge}>РОЛЬ: ADMIN</div>
          <div className={styles.badge}>Уровень: {user?.level}</div>
          <div className={styles.badge}>💰 {user?.gold} Gold</div>
          <div className={styles.badge}>⭐ {user?.xp} XP</div>

          <p style={{ marginTop: '40px', fontSize: '18px' }}>
            🔐 Это защищенная страница доступная только для <strong>ADMIN</strong>
          </p>

          <p style={{ marginTop: '20px', color: 'var(--color-text-300)' }}>
            Здесь будет панель управления:<br/><br/>
            • Управление пользователями<br/>
            • Просмотр статистики<br/>
            • Модерация контента<br/>
            • Системные настройки<br/>
          </p>

          <button className={styles.logoutButton} onClick={handleLogout}>
            🚪 ВЫХОД
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;

