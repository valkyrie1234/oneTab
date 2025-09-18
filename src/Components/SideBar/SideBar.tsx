import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
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
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__header}>
        <h1 className={styles.sidebar__title}>⚔️ OneTab</h1>
        <p className={styles.sidebar__subtitle}>Ваши квесты ждут!</p>
      </div>
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
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
