import Layout from "../Layout/Layout";
import Create from "../pages/Create/Create";
import Home from "../pages/Home/Home";
import Kanban from "../pages/Kanban/Kanban";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";

// Основные маршруты для приложения
export const routes = [
  {
    path: "/",
    element: <Layout><Home /></Layout>,
    label: "Таверна"
  },
  {
    path: "/kanban",
    element: <Layout><Kanban /></Layout>,
    label: "Карта приключений"
  },
  {
    path: "/create",
    element: <Layout><Create /></Layout>,
    label: "Создать квест"
  },
  {
    path: "/profile",
    element: <Layout><Profile /></Layout>,
    label: "Профиль героя"
  },
  {
    path: "*",
    element: <NotFound />,
    label: "Страница не найдена"
  },
];

// Маршруты для сайдбара (без страницы 404)
export const sidebarRoutes = routes.filter(route => route.path !== "*");
