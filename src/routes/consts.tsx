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
  // Публичные роуты (Auth)
  {
    path: "/login",
    element: <Login />,
    label: "Вход",
    isPublic: true
  },
  {
    path: "/register",
    element: <Register />,
    label: "Регистрация",
    isPublic: true
  },
  
  // Защищенные роуты (требуют аутентификацию)
  {
    path: "/",
    element: <PrivateRoute><Layout><Home /></Layout></PrivateRoute>,
    label: "Таверна"
  },
  {
    path: "/kanban",
    element: <PrivateRoute><Layout><Kanban /></Layout></PrivateRoute>,
    label: "Карта приключений"
  },
  {
    path: "/create",
    element: <PrivateRoute><Layout><Create /></Layout></PrivateRoute>,
    label: "Создать квест"
  },
  {
    path: "/profile",
    element: <PrivateRoute><Layout><Profile /></Layout></PrivateRoute>,
    label: "Профиль героя"
  },
  
  // Роуты для ADMIN
  {
    path: "/admin",
    element: <PrivateRoute requiredRole="ADMIN"><Admin /></PrivateRoute>,
    label: "Админ панель",
    adminOnly: true
  },
  
  // Роуты для MODERATOR и ADMIN
  {
    path: "/moderator",
    element: <PrivateRoute allowedRoles={["MODERATOR", "ADMIN"]}><Moderator /></PrivateRoute>,
    label: "Панель модератора",
    moderatorOnly: true
  },
  
  // 404
  {
    path: "*",
    element: <NotFound />,
    label: "Страница не найдена"
  },
];

// Маршруты для сайдбара (без страницы 404 и без auth страниц)
export const sidebarRoutes = routes.filter(
  route => route.path !== "*" && !route.isPublic && !route.adminOnly && !route.moderatorOnly
);
