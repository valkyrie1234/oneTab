import Layout from "../Layout/Layout";
import Create from "../pages/Create/Create";
import Home from "../pages/Home/Home";
import Kanban from "../pages/Kanban/Kanban";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Admin from "../pages/Admin/Admin";
import Moderator from "../pages/Moderator/Moderator";
import PrivateRoute from "./PrivateRoute";

// Основные маршруты для приложения
export const routes = [
  // Публичные роуты
  {
    path: "/",
    element: <Layout><Home /></Layout>,
    label: "🏰 Таверна",
    isPublic: true,
    showInSidebar: true
  },
  {
    path: "/login",
    element: <Layout><Login /></Layout>,
    label: "🚪 Авторизация",
    isPublic: true,
    showInSidebar: true,
    authOnly: true  // Показывать только неавторизованным
  },
  {
    path: "/register",
    element: <Layout><Register /></Layout>,
    label: "✨ Регистрация",
    isPublic: true,
    showInSidebar: true,
    authOnly: true  // Показывать только неавторизованным
  },
  
  // Защищенные роуты (требуют аутентификацию)
  {
    path: "/kanban",
    element: <PrivateRoute><Layout><Kanban /></Layout></PrivateRoute>,
    label: "🗺️ Карта приключений",
    showInSidebar: true
  },
  {
    path: "/create",
    element: <PrivateRoute><Layout><Create /></Layout></PrivateRoute>,
    label: "➕ Создать квест",
    showInSidebar: true
  },
  {
    path: "/profile",
    element: <PrivateRoute><Layout><Profile /></Layout></PrivateRoute>,
    label: "👤 Профиль героя",
    showInSidebar: true
  },
  
  // Роуты для ADMIN
  {
    path: "/admin",
    element: <PrivateRoute requiredRole="ADMIN"><Layout><Admin /></Layout></PrivateRoute>,
    label: "👑 Админ панель",
    adminOnly: true,
    showInSidebar: true
  },
  
  // Роуты для MODERATOR и ADMIN
  {
    path: "/moderator",
    element: <PrivateRoute allowedRoles={["MODERATOR", "ADMIN"]}><Layout><Moderator /></Layout></PrivateRoute>,
    label: "🛡️ Панель модератора",
    moderatorOnly: true,
    showInSidebar: true
  },
  
  // 404
  {
    path: "*",
    element: <Layout><NotFound /></Layout>,
    label: "Страница не найдена"
  },
];

// Функция для получения маршрутов для сайдбара в зависимости от авторизации
export const getSidebarRoutes = (isAuthenticated: boolean, userRole?: "USER" | "ADMIN" | "MODERATOR") => {
  return routes.filter(route => {
    // Скрываем 404
    if (route.path === "*") return false;
    
    // Не показываем в сайдбаре если нет флага
    if (!route.showInSidebar) return false;
    
    // Если не авторизован - показываем только публичные и authOnly
    if (!isAuthenticated) {
      return route.isPublic;
    }
    
    // Если авторизован - скрываем authOnly роуты (login/register)
    if (route.authOnly) return false;
    
    // Проверка прав для админ/модератор роутов
    if (route.adminOnly && userRole !== "ADMIN") return false;
    if (route.moderatorOnly && userRole !== "MODERATOR" && userRole !== "ADMIN") return false;
    
    return true;
  });
};
