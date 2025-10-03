# 🎨 Фронтенд - JWT Авторизация

## ✅ Что создано

### 📄 Новые страницы:
1. `/login` - Страница входа
2. `/register` - Страница регистрации  
3. `/admin` - Панель администратора (только ADMIN)
4. `/moderator` - Панель модератора (MODERATOR и ADMIN)

### 🔐 Защита роутов:
- `<PrivateRoute>` - требует аутентификацию
- `<PrivateRoute requiredRole="ADMIN">` - только для ADMIN
- `<PrivateRoute allowedRoles={["MODERATOR", "ADMIN"]}>` - для нескольких ролей

### 📦 Новые модули:
- `store/storeAuth.ts` - Zustand store для авторизации
- `api/client.ts` - API клиент с автообновлением токенов
- `api/types.ts` - TypeScript типы для API
- `routes/PrivateRoute.tsx` - компонент защиты роутов

---

## 🚀 Как использовать

### Запуск фронтенда:

```bash
cd oneTab
npm run dev
```

### Запуск бэкенда:

```bash
cd backend
npm run dev
```

---

## 🎯 Тестовые аккаунты

```
👤 USER:
   Email: user@example.com
   Пароль: password123

👑 ADMIN:
   Email: admin@example.com
   Пароль: admin123

🛡️ MODERATOR:
   Email: moderator@example.com
   Пароль: moderator123
```

---

## 🏗️ Структура Auth

### 1. Auth Store (Zustand + persist)

```typescript
interface IAuthStore {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  login: (user, accessToken, refreshToken) => void;
  logout: () => void;
  setUser: (user) => void;
  updateUser: (updates) => void;
}
```

**Сохраняется в localStorage** автоматически!

---

### 2. API Client

```typescript
// Автоматическая отправка токена
APIClient.get('/api/boards')
// → Headers: Authorization: Bearer TOKEN

// Автообновление при 401
APIClient.request(endpoint)
// → Если 401: refreshTokens() → повтор запроса
```

**Методы:**
- `APIClient.get(endpoint)` - GET запрос
- `APIClient.post(endpoint, data)` - POST запрос
- `APIClient.patch(endpoint, data)` - PATCH запрос
- `APIClient.delete(endpoint)` - DELETE запрос
- `APIClient.refreshTokens()` - обновление токенов

**API модули:**
- `AuthAPI.login(email, password)`
- `AuthAPI.register(username, email, password)`
- `AuthAPI.logout()`
- `AuthAPI.me()`
- `BoardsAPI.getAll()` - доски
- `TasksAPI.getUserTasks(userId)` - задачи

---

### 3. PrivateRoute

```typescript
// Только аутентифицированные
<PrivateRoute>
  <Home />
</PrivateRoute>

// Только ADMIN
<PrivateRoute requiredRole="ADMIN">
  <Admin />
</PrivateRoute>

// ADMIN или MODERATOR
<PrivateRoute allowedRoles={["MODERATOR", "ADMIN"]}>
  <Moderator />
</PrivateRoute>
```

---

## 📝 Пример использования в компонентах

### Получить текущего пользователя:

```typescript
import useAuthStore from "../store/storeAuth";

const MyComponent = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <div>Войдите в систему</div>;
  }
  
  return <div>Привет, {user?.username}!</div>;
};
```

### Вызов защищенного API:

```typescript
import { BoardsAPI } from "../api/client";

const fetchBoards = async () => {
  const response = await BoardsAPI.getAll();
  // API Client автоматически добавит токен
  console.log(response);
};
```

### Проверка роли:

```typescript
const user = useAuthStore((state) => state.user);

{user?.role === "ADMIN" && (
  <button>Админ функция</button>
)}

{["ADMIN", "MODERATOR"].includes(user?.role) && (
  <button>Модератор функция</button>
)}
```

---

## 🎨 Стилизация

Все формы в **пиксель-арт стиле**:
- Деревянные цвета (wood-100 до wood-800)
- Мистические акценты (mystic-400, mystic-500)
- Box shadows для 3D эффекта
- Pixel-perfect углы
- Courier New шрифт

---

## 🔄 Flow авторизации

### Регистрация:

```
1. Пользователь заполняет форму
   ↓
2. POST /api/auth/register
   ↓
3. Сервер создает пользователя (level=0, xp=0, gold=0)
   ↓
4. Возвращает { user, tokens }
   ↓
5. Сохраняем в Zustand + localStorage
   ↓
6. Редирект на /
```

### Вход:

```
1. Пользователь вводит email/password
   ↓
2. POST /api/auth/login
   ↓
3. Сервер проверяет bcrypt
   ↓
4. Возвращает { user, tokens }
   ↓
5. Редирект по роли:
   - ADMIN → /admin
   - MODERATOR → /moderator
   - USER → /
```

### Защищенные запросы:

```
1. Компонент вызывает API
   ↓
2. APIClient добавляет: Authorization: Bearer TOKEN
   ↓
3. Если 401:
   - Вызывает refreshTokens()
   - Повторяет запрос
   ↓
4. Если refresh failed:
   - logout()
   - Редирект на /login
```

---

## 🎮 Обновление SideBar

### Новые элементы:
- Информация о пользователе (имя, уровень, золото, XP)
- Роль badge (для ADMIN/MODERATOR)
- Ссылка на админ панель (только для ADMIN)
- Ссылка на панель модератора (для MODERATOR/ADMIN)
- Кнопка ВЫХОД

---

## 🔒 Безопасность

### На фронтенде:
- Токены в localStorage (persist)
- Автообновление Access Token
- Редирект при отсутствии прав
- Проверка роли перед рендером

### Рекомендации:
- ✅ Не храни sensitive данные в localStorage
- ✅ Всегда валидируй роль на бэкенде
- ✅ Используй HTTPS в продакшене

---

## 📋 Checklist

- [x] Создан Auth Store
- [x] Создан API Client
- [x] Создан Login
- [x] Создан Register
- [x] Создан Admin page
- [x] Создан Moderator page
- [x] Создан PrivateRoute
- [x] Обновлен routing
- [x] Обновлен SideBar
- [ ] Подключить реальные доски из API
- [ ] Подключить реальные задачи из API

---

**Готово!** 🎉 Фронтенд подключен к бэкенду с JWT!

Запусти фронтенд и попробуй залогиниться!

