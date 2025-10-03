import { Navigate } from "react-router-dom";
import useAuthStore from "../store/storeAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "ADMIN" | "MODERATOR";
  allowedRoles?: Array<"USER" | "ADMIN" | "MODERATOR">;
}

/**
 * Компонент для защиты роутов
 * Требует аутентификации и проверяет роль пользователя
 */
const PrivateRoute = ({ children, requiredRole, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  // Если не аутентифицирован - редирект на главную
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Проверка конкретной роли
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Проверка списка разрешенных ролей
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

