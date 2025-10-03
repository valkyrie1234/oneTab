import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/storeAuth";
import { getSidebarRoutes } from "../../routes/consts";
import { getRoleEmoji } from "../../helpers/userHelpers";
import styles from "./SideBar.module.css";
import classNames from "classnames";

const SideBar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Получаем маршруты в зависимости от авторизации и роли
  const links = useMemo(() => 
    getSidebarRoutes(isAuthenticated, user?.role), 
    [isAuthenticated, user?.role]
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__header}>
        <h1 className={styles.sidebar__title}>⚔️ OneTab</h1>
        <p className={styles.sidebar__subtitle}>Ваши квесты ждут!</p>
      </div>

      {/* Информация о пользователе */}
      {user && (
        <div className={styles.userInfo}>
          <div className={styles.userName}>
            {getRoleEmoji(user.role)} {user.username}
          </div>
          <div className={styles.userStats}>
            <span>Lvl {user.level}</span>
            <span>💰 {user.gold}</span>
            <span>⭐ {user.xp}</span>
          </div>
          {user.role !== "USER" && (
            <div className={styles.roleBadge}>{user.role}</div>
          )}
        </div>
      )}

      <nav>
        <ul className={styles.sidebar__list}>
          {links.map((link) => (
            <li key={link.path} className={styles.sidebar__item}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? classNames([styles.sidebar__link, styles.active])
                    : styles.sidebar__link
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Кнопка выхода */}
      {user && (
        <div className={styles.logoutSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            🚪 ВЫХОД
          </button>
        </div>
      )}
    </aside>
  );
};

export default SideBar;
