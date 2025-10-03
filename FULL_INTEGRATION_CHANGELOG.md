# 📝 Полный список изменений - Frontend ↔ Backend Integration

## 🎯 Цель
Подключить React фронтенд к Hono бэкенду с JWT авторизацией, RBAC и Prisma ORM.

---

## 📦 Установленные пакеты

### Backend:
```bash
npm install prisma @prisma/client
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
npm install @hono/swagger-ui
npm install dotenv
```

### Frontend:
```bash
npm install zustand
# React Router, DnD Kit уже были установлены
```

---

## 🗄️ Backend - Изменения базы данных

### 1. Prisma схема обновлена:

**Добавлены Enums:**
```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
  EPIC
  COMPLETED
}
```

**Модель User:**
```prisma
model User {
  role  Role  @default(USER)  // RBAC
  level Int   @default(0)     // Было: 1
  xp    Int   @default(0)
  gold  Int   @default(0)     // Было: coins
  // ...
}
```

**Модель Board:**
```prisma
model Board {
  id       String  @id @default(uuid())  // UUID вместо Int
  name     String                        // Было: title
  emoji    String?
  isSystem Boolean @default(false)       // Защита системных досок
  order    Int     @default(0)
  // ...
}
```

**Модель Task:**
```prisma
model Task {
  difficulty  Difficulty @default(MEDIUM)  // Было: priority
  rewardExp   Int        @default(50)      // Было: reward
  rewardGold  Int        @default(100)     // Было: coins
  isCompleted Boolean    @default(false)
  isFailed    Boolean    @default(false)
  dateCreate  DateTime   @default(now())   // Было: createdAt
  expiredDate DateTime?                    // Было: dueDate
  boardId     String?                      // UUID вместо Int
  // ...
}
```

---

## 🔐 Backend - JWT Авторизация

### Созданные файлы:

**1. services/auth.service.ts:**
- `hashPassword()` - bcrypt хеширование
- `comparePassword()` - проверка пароля
- `generateAccessToken()` - JWT (15 мин)
- `generateRefreshToken()` - JWT (7 дней)
- `register()` - регистрация с level=0, xp=0, gold=0
- `login()` - вход с проверкой пароля
- `refreshTokens()` - обновление токенов

**2. middleware/auth.ts:**
- `authenticate` - проверка JWT токена
- `optionalAuth` - опциональная проверка

**3. middleware/rbac.ts:**
- `adminOnly` - только ADMIN
- `moderatorOrAdmin` - MODERATOR или ADMIN
- `requireRole(roles)` - универсальная проверка
- `canEdit(ownerGetter)` - владелец или ADMIN

**4. controllers/auth.controller.ts:**
- `register` - POST /api/auth/register
- `login` - POST /api/auth/login
- `refresh` - POST /api/auth/refresh
- `me` - GET /api/auth/me
- `logout` - POST /api/auth/logout

**5. routes/auth.routes.ts:**
- Публичные роуты (register, login, refresh)
- Защищенные роуты (me, logout)

### Защита существующих роутов:

**users.routes.ts:**
```typescript
userRoutes.get('/', authenticate, adminOnly, ...)      // Только ADMIN
userRoutes.delete('/:id', authenticate, adminOnly, ...) // Только ADMIN
```

**boards.routes.ts, tasks.routes.ts:**
```typescript
// Все роуты требуют authenticate
boardRoutes.get('/', authenticate, ...)
taskRoutes.post('/', authenticate, ...)
```

---

## 📚 Backend - Swagger документация

### Модульная структура:

**Созданные файлы:**
- `swagger/schemas.ts` - общие схемы (User, Board, Task)
- `swagger/auth.swagger.ts` - Auth endpoints
- `swagger/users.swagger.ts` - Users endpoints
- `swagger/boards.swagger.ts` - Boards endpoints
- `swagger/tasks.swagger.ts` - Tasks endpoints
- `swagger/openapi.ts` - главный файл (собирает всё)

**Доступ:**
- Swagger UI: http://localhost:3005/docs
- OpenAPI JSON: http://localhost:3005/api/openapi.json

---

## 🎨 Frontend - Авторизация

### Созданные файлы:

**1. store/storeAuth.ts:**
```typescript
interface IAuthStore {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  login();
  logout();
  setUser();
  updateUser();
}
```
- **Persist:** автосохранение в localStorage

**2. api/client.ts:**
- `APIClient.request()` - базовый запрос с токенами
- `APIClient.get/post/patch/delete()` - HTTP методы
- `APIClient.refreshTokens()` - автообновление при 401
- `AuthAPI` - login, register, logout, me
- `BoardsAPI` - getAll, getById, create
- `TasksAPI` - getUserTasks, create, update, complete, delete

**3. api/types.ts:**
- TypeScript типы для API ответов
- `IUser`, `ITokens`, `IApiResponse<T>`
- `IAuthLoginResponse`, `IAuthRegisterResponse`

**4. routes/PrivateRoute.tsx:**
```typescript
// Проверка аутентификации
<PrivateRoute><Component /></PrivateRoute>

// Проверка роли
<PrivateRoute requiredRole="ADMIN">...
<PrivateRoute allowedRoles={["MODERATOR", "ADMIN"]}>...
```

**5. hooks/useLoadData.tsx:**
- Автоматическая загрузка досок и задач при логине
- Очистка данных при логауте
- Срабатывает в App.tsx

---

## 📄 Frontend - Новые страницы

### 1. pages/Login/Login.tsx + Login.module.css
- Форма входа в пиксель-арт стиле
- Валидация email/password
- Редирект по роли после входа:
  - ADMIN → /admin
  - MODERATOR → /moderator
  - USER → /
- Тестовые аккаунты внизу формы

### 2. pages/Register/Register.tsx
- Форма регистрации
- Валидация (password >= 6, username >= 3, совпадение паролей)
- Автоматический логин после регистрации
- Новый пользователь: level=0, xp=0, gold=0, role=USER

### 3. pages/Admin/Admin.tsx + Admin.module.css
- Защищена `requiredRole="ADMIN"`
- Показывает роль, уровень, статы
- Кнопка выхода
- Placeholder для будущего функционала

### 4. pages/Moderator/Moderator.tsx + Moderator.module.css
- Защищена `allowedRoles={["MODERATOR", "ADMIN"]}`
- Аналогично Admin
- Placeholder для модерации

---

## 🔄 Frontend - Обновление Stores

### storeBoards.ts - КРИТИЧЕСКИЕ изменения:

**Интерфейс:**
```typescript
// Было                →  Стало
id: number            →  id: string (UUID!)
title: string         →  name: string
                      +  description, color, order
                      +  isSystem, userId
                      +  createdAt, updatedAt

boards: [моки]        →  boards: []  // Загрузка с API
```

**Новые методы:**
- `setBoards(boards)` - загрузка с сервера
- `updateBoard(id, updates)`
- `deleteBoard(id)`

### storeTasks.ts - КРИТИЧЕСКИЕ изменения:

**Интерфейс:**
```typescript
// Было                  →  Стало
status: DifficultyStatus → difficulty: Difficulty (EASY/MEDIUM/HARD/EPIC)
boardId: number          → boardId: string (UUID!)
reward.gold              → rewardGold: number
reward.exp               → rewardExp: number
dateCreate: Date         → dateCreate: string (ISO)
expiredDate: Date|null   → expiredDate: string|null

tasks: [10+ моков]       → tasks: []  // Загрузка с API
```

**Новые методы:**
- `setTasks(tasks)` - загрузка с сервера
- `updateTask(id, updates)`

---

## 🎨 Frontend - Обновление компонентов

### 1. App.tsx
```typescript
+ import ErrorBoundary
+ import useLoadData
+ import useAuthStore

function App() {
  useLoadData();  // Загрузка данных при монтировании
  
  return (
    <ErrorBoundary>  // Защита от падения приложения
      <Routes>...</Routes>
    </ErrorBoundary>
  );
}
```

### 2. routes/consts.tsx
```typescript
+ import Login, Register, Admin, Moderator
+ import PrivateRoute

// Публичные роуты
{ path: "/login", element: <Login />, isPublic: true }
{ path: "/register", element: <Register />, isPublic: true }

// Защищенные роуты
{ path: "/", element: <PrivateRoute><Layout><Home /></Layout></PrivateRoute> }

// Админ/Модератор
{ path: "/admin", element: <PrivateRoute requiredRole="ADMIN"><Admin /></PrivateRoute> }
{ path: "/moderator", element: <PrivateRoute allowedRoles={["MODERATOR", "ADMIN"]}><Moderator /></PrivateRoute> }

// Обновлен sidebarRoutes фильтр
```

### 3. Components/SideBar/SideBar.tsx
**Добавлено:**
- Информация о пользователе (имя, роль, level, gold, xp)
- Роль badge (ADMIN/MODERATOR)
- Ссылки на админ/модератор панели (условный рендеринг)
- Кнопка ВЫХОД

**CSS обновлен:**
- `.userInfo`, `.userName`, `.userStats`
- `.roleBadge`
- `.logoutSection`, `.logoutButton`

### 4. Components/Board/Board.tsx
**КРИТИЧЕСКИЕ изменения:**
```typescript
// Было                  →  Стало
id: number             →  id: string (UUID)
title: string          →  name: string (+ поддержка title для совместимости)
boardId === 0          →  boardName === 'all tasks'
data-board-id={id}     →  data-board-name={boardName}

// Добавлена функция
getBoardClass() // Возвращает CSS класс по имени доски
```

**Фильтрация задач:**
```typescript
// Теперь сравнивает UUID строки
task.boardId === id  // (оба string)
```

### 5. Components/Board/Board.module.css
**Переписаны селекторы:**
```css
/* Было */
.mainBoard[data-board-id="1"] { ... }

/* Стало */
.startBoard { ... }
.progressBoard { ... }
.victoryBoard { ... }
.defeatBoard { ... }

/* Также обновлены */
.mainBoard[data-board-name="all tasks"] { ... }
```

### 6. Components/TaskCard/TaskCard.tsx
**Изменения:**
```typescript
// Пропсы обновлены
- status → difficulty
- reward → rewardExp, rewardGold
- TaskCardProps → ITasks

// Маппинг для Badge
statusMap = { 'EASY': 'easy', ... }

// Конвертация дат
dateCreate: new Date(dateCreate)  // string → Date
expiredDate: expiredDate ? new Date(expiredDate) : null
```

### 7. Components/SmallTaskCard/SmallTaskCard.tsx
**Аналогичные изменения:**
- Обновлены пропсы под ITasks
- Маппинг difficulty → status
- Конвертация дат
- **Drag and Drop:**
  - Listeners на `.dragHandle` обертке
  - Кнопка удаления с `onPointerDown` блокировкой
  - `cursor: grab` на dragHandle

**CSS:**
- Добавлен `.dragHandle` класс
- Удалены проверки `boardId === 1, 2, 3, 4` (были числа)

### 8. pages/Kanban/Kanban.tsx
**КРИТИЧЕСКИЕ изменения:**
```typescript
// Фильтрация досок
- boards.filter(b => b.id === 0)
+ boards.find(b => b.name === 'all tasks')

- boards.filter(b => b.id !== 0)
+ boards.filter(b => b.name !== 'all tasks').sort((a,b) => a.order - b.order)

// Передача пропсов
- title={board.title}
+ title={board.name}

// Drag and Drop
- const newBoardId = parseInt(over.id as string);
+ const newBoardId = over.id as string;  // UUID!

- moveTask(taskId, newBoardId: number)
+ moveTask(taskId, newBoardId: string)
```

### 9. Components/ErrorBoundary (НОВЫЙ!)
- Отлавливает ошибки React компонентов
- Пиксель-арт стиль страницы ошибки
- Dev stack trace (только в разработке)
- Кнопки "Вернуться" и "Перезагрузить"

---

## 🔄 Миграция данных

### До:
```typescript
// Моки в stores
boards: [
  { id: 0, title: "All Tasks", emoji: "📋" },
  { id: 1, title: "start", emoji: "🎯" },
  // ...
]

tasks: [
  { id: "1", status: "easy", reward: { gold: 100, exp: 50 }, ... },
  // 10+ моковых задач
]
```

### После:
```typescript
// Пустые массивы
boards: []  // Загружается через useLoadData
tasks: []   // Загружается через useLoadData

// Данные приходят с сервера
boards: [
  { 
    id: "uuid-string",
    name: "all tasks",
    emoji: "📋",
    isSystem: true,
    order: 0,
    userId: "user-uuid",
    createdAt: "2025-10-03...",
    updatedAt: "2025-10-03..."
  },
  // ...
]

tasks: [
  {
    id: "uuid-string",
    difficulty: "MEDIUM",
    rewardExp: 100,
    rewardGold: 200,
    boardId: "board-uuid",
    userId: "user-uuid",
    // ...
  }
]
```

---

## 🛡️ RBAC - Защита роутов

### routes/consts.tsx:

**Публичные (без защиты):**
- `/login`
- `/register`

**Защищенные (требуют авторизацию):**
- `/` (Home)
- `/kanban`
- `/create`
- `/profile`

**Только ADMIN:**
- `/admin`

**MODERATOR + ADMIN:**
- `/moderator`

### Реализация:
```typescript
<PrivateRoute>
  <Layout><Home /></Layout>
</PrivateRoute>

<PrivateRoute requiredRole="ADMIN">
  <Admin />
</PrivateRoute>
```

---

## 🔑 Ключевые breaking changes

### 1. Board ID: number → string (UUID)
```typescript
// Везде заменить
boardId: number  →  boardId: string
board.id === 0   →  board.name === 'all tasks'
```

### 2. Board title → name
```typescript
board.title  →  board.name
```

### 3. Task status → difficulty
```typescript
task.status: "easy"  →  task.difficulty: "EASY"
```

### 4. Task reward → rewardExp, rewardGold
```typescript
task.reward.exp   →  task.rewardExp
task.reward.gold  →  task.rewardGold
```

### 5. Даты: Date → string (ISO)
```typescript
dateCreate: Date         →  dateCreate: string
expiredDate: Date|null   →  expiredDate: string|null

// При использовании
new Date(dateCreate)  // Конвертация обратно
```

---

## 🎮 Flow работы приложения

### 1. Загрузка приложения:
```
App.tsx монтируется
  ↓
useLoadData() срабатывает
  ↓
Проверка: user в storeAuth?
  ↓ НЕТ
Очистка stores (boards=[], tasks=[])
  ↓
Показ публичных страниц (/login)
```

### 2. Логин:
```
Форма Login → POST /api/auth/login
  ↓
{ user, tokens } получены
  ↓
storeAuth.login(user, accessToken, refreshToken)
  ↓
localStorage сохранение
  ↓
useLoadData() срабатывает (user изменился!)
  ↓
BoardsAPI.getAll(user.id) → setBoards()
TasksAPI.getUserTasks(user.id) → setTasks()
  ↓
Редирект по роли (/, /admin, /moderator)
  ↓
Компоненты рендерятся с данными с сервера ✅
```

### 3. Защищенный запрос:
```
Компонент вызывает APIClient.get('/api/boards')
  ↓
APIClient добавляет: Authorization: Bearer TOKEN
  ↓
Сервер проверяет JWT (authenticate middleware)
  ↓
Если 401 (токен истек):
  - APIClient.refreshTokens()
  - Получение новых токенов
  - Повтор исходного запроса
  ↓
Данные возвращаются
```

### 4. Drag and Drop:
```
Пользователь хватает карточку
  ↓
useDraggable() на dragHandle обертке
  ↓
Перетаскивание на доску
  ↓
handleDragEnd({ active, over })
  ↓
moveTask(taskId: string, newBoardId: string)  // UUID!
  ↓
Zustand обновляет tasks
  ↓
TODO: отправить PATCH /api/tasks/:id на бэкенд
```

---

## 🎨 Стилизация

### Все формы в пиксель-арт стиле:
- Деревянные цвета (wood-100 → wood-800)
- Мистические акценты (mystic-400, mystic-500)
- Box shadows для 3D эффекта (4px 4px 0, 6px 6px 0)
- Pixel-perfect углы (::before, ::after)
- Courier New моноширинный шрифт
- Transform на :active (translate(2px, 2px))

### Новые компоненты:
- Login/Register формы
- Admin/Moderator панели
- ErrorBoundary страница
- SideBar userInfo блок

---

## 📊 Файловая структура

### Backend:
```
backend/
├── prisma/
│   ├── schema.prisma (обновлена)
│   └── seed.ts (хеширование паролей)
├── src/
│   ├── services/
│   │   ├── auth.service.ts (НОВЫЙ)
│   │   ├── user.service.ts
│   │   ├── board.service.ts
│   │   └── task.service.ts
│   ├── controllers/
│   │   ├── auth.controller.ts (НОВЫЙ)
│   │   ├── user.controller.ts
│   │   ├── board.controller.ts
│   │   └── task.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts (НОВЫЙ)
│   │   ├── user.routes.ts (защищен)
│   │   ├── board.routes.ts (защищен)
│   │   └── task.routes.ts (защищен)
│   ├── middleware/
│   │   ├── auth.ts (НОВЫЙ)
│   │   └── rbac.ts (НОВЫЙ)
│   ├── swagger/
│   │   ├── openapi.ts (обновлен)
│   │   ├── schemas.ts (НОВЫЙ)
│   │   ├── auth.swagger.ts (НОВЫЙ)
│   │   ├── users.swagger.ts (НОВЫЙ)
│   │   ├── boards.swagger.ts (НОВЫЙ)
│   │   └── tasks.swagger.ts (НОВЫЙ)
│   └── app.ts (обновлен)
└── .env (добавлены JWT_SECRET, JWT_REFRESH_SECRET)
```

### Frontend:
```
oneTab/
├── src/
│   ├── store/
│   │   ├── storeAuth.ts (НОВЫЙ)
│   │   ├── storeBoards.ts (ОБНОВЛЕН - удалены моки)
│   │   └── storeTasks.ts (ОБНОВЛЕН - удалены моки)
│   ├── api/
│   │   ├── client.ts (НОВЫЙ)
│   │   └── types.ts (НОВЫЙ)
│   ├── hooks/
│   │   └── useLoadData.tsx (НОВЫЙ)
│   ├── routes/
│   │   ├── PrivateRoute.tsx (НОВЫЙ)
│   │   └── consts.tsx (ОБНОВЛЕН)
│   ├── pages/
│   │   ├── Login/ (НОВЫЙ)
│   │   ├── Register/ (НОВЫЙ)
│   │   ├── Admin/ (НОВЫЙ)
│   │   └── Moderator/ (НОВЫЙ)
│   ├── Components/
│   │   ├── ErrorBoundary/ (НОВЫЙ)
│   │   ├── Board/ (ОБНОВЛЕН)
│   │   ├── TaskCard/ (ОБНОВЛЕН)
│   │   ├── SmallTaskCard/ (ОБНОВЛЕН)
│   │   └── SideBar/ (ОБНОВЛЕН)
│   └── App.tsx (ОБНОВЛЕН)
```

---

## 🧪 Тестовые аккаунты

```
👤 USER:
   Email: user@example.com
   Пароль: password123
   Level: 3, XP: 250, Gold: 500

👑 ADMIN:
   Email: admin@example.com
   Пароль: admin123
   Level: 10, XP: 1000, Gold: 5000

🛡️ MODERATOR:
   Email: moderator@example.com
   Пароль: moderator123
   Level: 5, XP: 500, Gold: 2000
```

---

## 🚀 Команды для запуска

### Backend:
```bash
cd backend
npm run dev  # http://localhost:3005
```

### Frontend:
```bash
cd oneTab
npm run dev  # http://localhost:5173
```

### Prisma Studio (GUI для БД):
```bash
cd backend
npm run prisma:studio  # http://localhost:5555
```

---

## ✅ Checklist готовности

- [x] PostgreSQL база данных настроена
- [x] Prisma схема создана (User, Board, Task)
- [x] RBAC добавлен (USER, ADMIN, MODERATOR)
- [x] JWT авторизация (Access + Refresh токены)
- [x] Bcrypt хеширование паролей
- [x] Swagger документация (модульная)
- [x] 26 API endpoints
- [x] Frontend Auth Store (persist)
- [x] API Client с auto-refresh
- [x] Login/Register страницы
- [x] Admin/Moderator панели
- [x] PrivateRoute защита
- [x] ErrorBoundary
- [x] Моки удалены из stores
- [x] Автозагрузка данных (useLoadData)
- [x] Компоненты обновлены под новые типы
- [x] Drag and Drop работает с UUID
- [x] CSS стили обновлены

---

## 🎯 TODO (что осталось сделать)

### Критично:
- [ ] Отправка изменений на бэкенд при drag and drop
- [ ] Создание задач через API (сейчас только локально)
- [ ] Удаление задач через API
- [ ] Завершение задач через POST /api/tasks/:id/complete

### Улучшения:
- [ ] Обновление статов пользователя в реальном времени
- [ ] Загрузка досок и задач при переходе между страницами
- [ ] Обработка ошибок сети (показ уведомлений)
- [ ] Rate limiting на бэкенде
- [ ] Refresh Token в БД (blacklist)
- [ ] Тесты (frontend + backend)

---

## 📚 Документация

### Backend:
- `JWT_AUTH_GUIDE.md` - гайд по JWT
- `PRISMA_SETUP_EXPLAINED.md` - Prisma объяснение
- `SCHEMA_CHANGES.md` - изменения схемы
- `API_BOARDS.md` - API документация
- `SWAGGER_DOCS.md` - Swagger
- `QUICK_START.md` - быстрый старт

### Frontend:
- `FRONTEND_AUTH_GUIDE.md` - auth интеграция
- `STORE_MIGRATION.md` - миграция stores
- `INTEGRATION_COMPLETE.md` - процесс интеграции
- `FINAL_SETUP.md` - финальная настройка
- `FULL_INTEGRATION_CHANGELOG.md` - этот файл

---

## 🎉 Результат

**Backend:**
- ✅ 26 защищенных API endpoints
- ✅ JWT авторизация
- ✅ RBAC (3 роли)
- ✅ PostgreSQL + Prisma
- ✅ Swagger UI для тестирования

**Frontend:**
- ✅ Авторизация с JWT
- ✅ Защищенные роуты
- ✅ Админ/Модератор панели
- ✅ Загрузка данных с API
- ✅ Пиксель-арт дизайн
- ✅ Drag and Drop работает

**Готово к использованию!** 🚀

