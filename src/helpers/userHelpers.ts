/**
 * Хелперы для работы с пользователями
 */

type UserRole = "USER" | "ADMIN" | "MODERATOR";

/**
 * Получить эмодзи для роли пользователя
 * @param role - роль пользователя
 * @returns эмодзи роли
 */
export const getRoleEmoji = (role: UserRole | string): string => {
  switch (role) {
    case "ADMIN": 
      return "👑";
    case "MODERATOR": 
      return "🛡️";
    case "USER":
    default: 
      return "👤";
  }
};

/**
 * Получить CSS класс для бейджа роли
 * @param role - роль пользователя
 * @param styles - объект стилей компонента
 * @returns имя класса для роли
 */
export const getRoleBadgeClass = (role: UserRole | string, styles: any): string => {
  switch (role) {
    case "ADMIN": 
      return styles.roleAdmin;
    case "MODERATOR": 
      return styles.roleModerator;
    case "USER":
    default: 
      return styles.roleUser;
  }
};

/**
 * Получить название роли на русском
 * @param role - роль пользователя
 * @returns название роли
 */
export const getRoleLabel = (role: UserRole | string): string => {
  switch (role) {
    case "ADMIN": 
      return "Администратор";
    case "MODERATOR": 
      return "Модератор";
    case "USER":
    default: 
      return "Пользователь";
  }
};

/**
 * Получить цвет для роли
 * @param role - роль пользователя
 * @returns hex цвет
 */
export const getRoleColor = (role: UserRole | string): string => {
  switch (role) {
    case "ADMIN": 
      return "#FFD700";
    case "MODERATOR": 
      return "#87CEEB";
    case "USER":
    default: 
      return "#D2B48C";
  }
};

