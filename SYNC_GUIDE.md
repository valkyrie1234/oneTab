# 🔄 Frontend ↔ Backend Синхронизация

## 📝 Проблема

**Было:** Drag and Drop, создание, удаление задач работали только локально в Zustand. При перезагрузке страницы все изменения терялись.

**Решение:** Добавлена полная синхронизация с backend через API.

---

## ✅ Реализованная синхронизация

### 1. **Создание задачи** ✨
**Где:** `CreateModal.tsx`

```typescript
const response = await TasksAPI.create({...});

if (response.success) {
  // Добавляем в локальный store
  createTask(response.data);
  
  // ✅ Уведомление
  addNotification("success", "⚔️ Квест успешно создан!", "🎯");
}
```

**Флоу:**
1. Пользователь заполняет форму
2. POST `/api/tasks` → backend
3. Backend создает задачу в БД
4. Задача добавляется в Zustand
5. Всплывашка "Квест создан!"

---

### 2. **Drag and Drop** 🎯
**Где:** `Kanban.tsx`

```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  // 1. Оптимистичное обновление UI
  await moveTask(taskId, newBoardId);
  
  // 2. Синхронизация с backend
  const response = await TasksAPI.update(taskId, { boardId: newBoardId });
  
  if (response.success) {
    // ✅ Успех
    addNotification("info", `Квест перемещен в "${boardName}"`, "📦");
  } else {
    // ❌ Откат изменений
    await moveTask(taskId, oldBoardId);
    addNotification("error", "Не удалось синхронизировать", "☠️");
  }
}
```

**Флоу:**
1. Пользователь перетаскивает задачу
2. UI обновляется **сразу** (optimistic update)
3. PATCH `/api/tasks/:id` → backend
4. Backend обновляет `boardId` в БД
5. Если ошибка → откат изменений
6. Всплывашка с результатом

**Особенности:**
- ✅ Optimistic UI - мгновенный отклик
- ✅ Rollback при ошибке
- ✅ Проверка изменения доски (если не изменилась - пропускаем)

---

### 3. **Удаление задачи** ❌
**Где:** `SmallTaskCard.tsx`

```typescript
const handleDelete = async (e: React.MouseEvent) => {
  setDeleting(true);
  
  const success = await deleteTaskAsync(id);
  
  if (success) {
    addNotification("success", "Квест отменен!", "❌");
  } else {
    addNotification("error", "Не удалось отменить квест", "☠️");
    setDeleting(false);
  }
};
```

**Флоу:**
1. Пользователь нажимает ❌
2. Кнопка меняется на ⏳
3. DELETE `/api/tasks/:id` → backend
4. Backend удаляет задачу из БД
5. Удаление из Zustand только после успеха
6. Всплывашка с результатом

**Особенности:**
- ✅ Loading state (⏳)
- ✅ Disabled кнопка во время удаления
- ✅ Удаление из store только после подтверждения backend

---

## 🎨 Уведомления

### Типы уведомлений:

#### Success (Успех)
```typescript
addNotification("success", "⚔️ Квест успешно создан!", "🎯", 5000);
```
- **Цвет:** Золотой
- **Когда:** Успешное создание, завершение

#### Info (Информация)
```typescript
addNotification("info", "Квест перемещен в 'start'", "📦", 3000);
```
- **Цвет:** Зеленый
- **Когда:** Перемещение задач, обновления

#### Error (Ошибка)
```typescript
addNotification("error", "Не удалось создать квест", "☠️", 5000);
```
- **Цвет:** Серый
- **Когда:** Ошибки API, сети

---

## 📊 Zustand Store

### Методы:

```typescript
interface ITasksStore {
  // Синхронные
  tasks: ITasks[];
  setTasks: (tasks: ITasks[]) => void;
  createTask: (task: ITasks) => void;
  deleteTask: (id: string) => void;  // Локальное
  updateTask: (id: string, updates: Partial<ITasks>) => void;
  
  // Асинхронные (с backend)
  deleteTaskAsync: (id: string) => Promise<boolean>;
  moveTask: (taskId: string, newBoardId: string) => Promise<void>;
  
  // Утилиты
  checkExpiredTasks: () => void;
}
```

---

## 🔧 API Методы

### TasksAPI:

```typescript
TasksAPI.getUserTasks(userId: string)  // GET /api/tasks?userId=xxx
TasksAPI.getById(id: string)           // GET /api/tasks/:id
TasksAPI.create(data: unknown)         // POST /api/tasks
TasksAPI.update(id: string, data)      // PATCH /api/tasks/:id
TasksAPI.complete(id: string)          // POST /api/tasks/:id/complete
TasksAPI.delete(id: string)            // DELETE /api/tasks/:id
```

---

## 🎯 Optimistic UI

### Что это?
UI обновляется **до** подтверждения backend, создавая ощущение мгновенного отклика.

### Реализация:

```typescript
// 1. Сразу обновляем UI
await moveTask(taskId, newBoardId);

// 2. Отправляем на backend
const response = await TasksAPI.update(...);

// 3. Если ошибка - откатываем
if (!response.success) {
  await moveTask(taskId, oldBoardId);  // Rollback
}
```

### Преимущества:
- ✅ Мгновенный отклик
- ✅ Хороший UX
- ✅ Работает даже при медленном интернете

### Недостатки:
- ⚠️ Нужен rollback при ошибках
- ⚠️ Возможны race conditions

---

## 🐛 Обработка ошибок

### 1. Сетевые ошибки:
```typescript
try {
  const response = await TasksAPI.create(...);
} catch (error) {
  console.error('Ошибка:', error);
  addNotification("error", "Проблемы с сервером", "☠️");
}
```

### 2. API ошибки:
```typescript
if (response.success) {
  // Успех
} else {
  // response.error содержит сообщение
  addNotification("error", response.error, "☠️");
}
```

### 3. Rollback:
```typescript
// Сохраняем старое состояние
const oldBoardId = task?.boardId;

// Обновляем
await moveTask(taskId, newBoardId);

// Откат при ошибке
if (!response.success && oldBoardId) {
  await moveTask(taskId, oldBoardId);
}
```

---

## 📝 Changelog

### Изменено:

#### storeTasks.ts:
- ✅ `moveTask` теперь `async`
- ✅ Добавлен `deleteTaskAsync`
- ✅ Оптимистичное обновление

#### Kanban.tsx:
- ✅ `handleDragEnd` теперь `async`
- ✅ Синхронизация с backend
- ✅ Rollback при ошибках
- ✅ Уведомления

#### SmallTaskCard.tsx:
- ✅ `handleDelete` теперь `async`
- ✅ Loading state (⏳)
- ✅ Уведомления

#### CreateModal.tsx:
- ✅ Интеграция с API
- ✅ Уведомления

---

## 🧪 Тестирование

### Создание задачи:
1. Создай задачу
2. ✅ Всплывашка "Квест создан"
3. ✅ Задача появляется на досках
4. Перезагрузи страницу (F5)
5. ✅ Задача осталась на месте

### Drag and Drop:
1. Перетащи задачу на другую доску
2. ✅ Задача сразу перемещается
3. ✅ Всплывашка "Квест перемещен"
4. Перезагрузи страницу
5. ✅ Задача на новой доске

### Удаление:
1. Нажми ❌ на задаче
2. ✅ Кнопка меняется на ⏳
3. ✅ Всплывашка "Квест отменен"
4. ✅ Задача исчезает
5. Перезагрузи страницу
6. ✅ Задача не появилась

---

## ✅ Готово!

Все операции с задачами теперь синхронизируются с backend! 🎉

**Особенности:**
- ✅ Optimistic UI (мгновенный отклик)
- ✅ Rollback при ошибках
- ✅ Красивые уведомления
- ✅ Loading states
- ✅ Полная синхронизация с БД

