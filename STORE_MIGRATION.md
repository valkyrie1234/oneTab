# 🔄 Миграция Zustand Store на Backend API

## ✅ Что изменено

### 📦 Обновленные стор:

#### 1. **storeBoards.ts**

**Было:**
```typescript
interface IBoard {
  id: number;        // ❌
  title: string;     // ❌
  emoji?: string;
}

boards: [
  { title: "All Tasks", emoji: "📋", id: 0 },  // Моковые данные
  // ...
]
```

**Стало:**
```typescript
interface IBoard {
  id: string;           // ✅ UUID с бэкенда
  name: string;         // ✅ Как на бэкенде
  emoji?: string;
  description?: string;
  color?: string;
  order: number;
  isSystem: boolean;    // ✅ Защита системных досок
  userId: string;
  createdAt: string;
  updatedAt: string;
}

boards: []  // ✅ Загружается с сервера
```

**Новые методы:**
- `setBoards(boards)` - загрузка с сервера
- `updateBoard(id, updates)` - обновление доски
- `deleteBoard(id)` - удаление доски

---

#### 2. **storeTasks.ts**

**Было:**
```typescript
interface ITasks {
  status?: DifficultyStatus;  // ❌
  boardId: number;            // ❌
  reward: {                   // ❌
    gold: number;
    exp: number;
  };
}

tasks: [
  { id: "1", title: "...", ...},  // 10+ моковых задач
  // ...
]
```

**Стало:**
```typescript
interface ITasks {
  difficulty: Difficulty;      // ✅ EASY/MEDIUM/HARD/EPIC
  boardId: string | null;      // ✅ UUID доски
  rewardExp: number;           // ✅ Как на бэкенде
  rewardGold: number;          // ✅ Как на бэкенде
  dateCreate: string;          // ✅ ISO string
  userId: string;
  // + еще поля с бэкенда
}

tasks: []  // ✅ Загружается с сервера
```

**Новые методы:**
- `setTasks(tasks)` - загрузка с сервера
- `updateTask(id, updates)` - обновление задачи

---

#### 3. **storeAuth.ts** (новый!)

```typescript
interface IAuthStore {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  login(user, accessToken, refreshToken);
  logout();
  setUser(user);
  updateUser(updates);
}
```

**Persist:** Автосохранение в localStorage

---

## 🔄 Миграция данных

### Загрузка досок:

```typescript
import { BoardsAPI } from "../api/client";
import useBoardsStore from "../store/storeBoards";

const loadBoards = async (userId: string) => {
  const response = await BoardsAPI.getAll(userId);
  
  if (response.success) {
    useBoardsStore.getState().setBoards(response.data.boards);
  }
};
```

### Загрузка задач:

```typescript
import { TasksAPI } from "../api/client";
import useTasksStore from "../store/storeTasks";

const loadTasks = async (userId: string) => {
  const response = await TasksAPI.getUserTasks(userId);
  
  if (response.success) {
    useTasksStore.getState().setTasks(response.data.tasks);
  }
};
```

---

## 📝 Что делать в компонентах

### Старый код (моки):

```typescript
const boards = useBoardsStore((state) => state.boards);
// boards всегда заполнены моками
```

### Новый код (API):

```typescript
import { useEffect } from "react";
import { BoardsAPI } from "../api/client";

const Component = () => {
  const { boards, setBoards } = useBoardsStore();
  const user = useAuthStore((state) => state.user);
  
  useEffect(() => {
    const fetchBoards = async () => {
      if (user) {
        const response = await BoardsAPI.getAll(user.id);
        if (response.success) {
          setBoards(response.data.boards);
        }
      }
    };
    
    fetchBoards();
  }, [user]);
  
  return <div>{boards.map(...)}</div>;
};
```

---

## ⚠️ Breaking Changes

### 1. Board ID изменен:

```typescript
// Было
boardId: 0  // number

// Стало
boardId: "uuid-string"  // string
```

### 2. Board field переименован:

```typescript
// Было
board.title

// Стало
board.name
```

### 3. Task reward изменен:

```typescript
// Было
task.reward.gold
task.reward.exp

// Стало
task.rewardGold
task.rewardExp
```

### 4. Task status → difficulty:

```typescript
// Было
task.status  // "easy" | "medium" | "hard"

// Стало
task.difficulty  // "EASY" | "MEDIUM" | "HARD" | "EPIC"
```

---

## 🔍 Что нужно обновить в компонентах

### Поиск и замена:

1. `board.title` → `board.name`
2. `board.id` (проверить, что это string UUID)
3. `task.status` → `task.difficulty`
4. `task.reward.gold` → `task.rewardGold`
5. `task.reward.exp` → `task.rewardExp`
6. `boardId: number` → `boardId: string`

---

## 📚 Файлы для обновления

Компоненты которые нужно обновить:
- `Components/Board/Board.tsx` - использует boards
- `Components/TaskCard/TaskCard.tsx` - использует task
- `Components/AllTaskList/AllTaskList.tsx` - использует tasks
- `pages/Kanban/Kanban.tsx` - использует boards
- `pages/Home/Home.tsx` - использует tasks
- `pages/Create/Create.tsx` - создание задач

---

**Готово!** 🎉 Моки убраны, интерфейсы обновлены под бэкенд!

Теперь нужно обновить компоненты для работы с API.

