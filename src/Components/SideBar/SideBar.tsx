import React, { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/storeAuth";
import styles from "./SideBar.module.css";
import classNames from "classnames";

type TLink = {
  label: string;
  path: string;
  element: ReactNode;
};

type SideBarProps = {
  links?: TLink[];
};

const SideBar: React.FC<SideBarProps> = ({ links }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleEmoji = (role: string) => {
    switch (role) {
      case "ADMIN": return "👑";
      case "MODERATOR": return "🛡️";
      default: return "👤";
    }
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
          {links?.map((link) => (
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

          {/* Админ панель */}
          {user?.role === "ADMIN" && (
            <li className={styles.sidebar__item}>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive
                    ? classNames([styles.sidebar__link, styles.active])
                    : styles.sidebar__link
                }
              >
                👑 Админ панель
              </NavLink>
            </li>
          )}

          {/* Панель модератора */}
          {(user?.role === "MODERATOR" || user?.role === "ADMIN") && (
            <li className={styles.sidebar__item}>
              <NavLink
                to="/moderator"
                className={({ isActive }) =>
                  isActive
                    ? classNames([styles.sidebar__link, styles.active])
                    : styles.sidebar__link
                }
              >
                🛡️ Панель модератора
              </NavLink>
            </li>
          )}
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
