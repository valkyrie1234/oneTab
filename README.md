# Kanban Board с Drag and Drop

## Описание проекта

Это Kanban доска с функциональностью drag and drop для управления задачами. Проект позволяет создавать задачи и перетаскивать их между различными досками для отслеживания прогресса.

## Структура досок

Проект содержит 5 досок:

1. **All Tasks** (ID: 0) - главная доска сверху, отображает все новые задачи
2. **Start** (ID: 1) - доска для начатых задач
3. **In Progress** (ID: 2) - доска для задач в процессе выполнения
4. **Victory** (ID: 3) - доска для завершенных задач
5. **Defeat** (ID: 4) - доска для отмененных/неудачных задач

## Реализованная функциональность Drag and Drop

### Что было сделано для работы drag and drop:

#### 1. Установка и настройка @dnd-kit
- Установлен пакет `@dnd-kit/core@6.0.8`
- Удален конфликтующий пакет `dnd-kit` (старая версия)
- Удален `@dnd-kit/sortable` для избежания конфликтов версий

#### 2. Настройка DndContext в Kanban.tsx
```typescript
<DndContext 
  onDragStart={handleDragStart}
  onDragOver={handleDragOver}
  onDragEnd={handleDragEnd}
  sensors={sensors}
  collisionDetection={closestCenter}
>
```

#### 3. Конфигурация sensors
```typescript
const sensors = useSensors(
  useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  })
);
```

#### 4. Обработчики событий
- `handleDragStart` - сохраняет ID активной задачи
- `handleDragOver` - заготовка для будущих улучшений
- `handleDragEnd` - перемещает задачу между досками

#### 5. Настройка draggable элементов
В `TaskCard.tsx` и `SmallTaskCard.tsx`:
```typescript
const { setNodeRef, listeners, attributes } = useDraggable({ id: id });

return (
  <div 
    ref={setNodeRef} 
    {...listeners}
    {...attributes}
    className={styles.taskCard}
  >
```

#### 6. Настройка droppable зон
В `Board.tsx`:
```typescript
const { setNodeRef, isOver } = useDroppable({ id: id.toString() });

return (
  <div 
    ref={setNodeRef} 
    className={`${styles.mainBoard} ${isOver ? styles.dragOver : ''}`}
  >
```

#### 7. Обновление store
Изменена типизация в `storeTasks.ts`:
```typescript
export interface ITasks {
  boardId: number; // 0 = All Tasks, 1-4 = другие доски
}

export interface ITasksStore {
  moveTask: (taskId: string, newBoardId: number) => void;
}
```

#### 8. Обновление досок в store
В `storeBoards.ts` добавлена доска All Tasks:
```typescript
boards: [
  { title: "All Tasks", emoji: "📋", id: 0 },
  { title: "start", emoji: "🎯", id: 1 },
  { title: "in progress", emoji: "⚔️", id: 2 },
  { title: "victory", emoji: "🌟🌟🌟", id: 3 },
  { title: "defeat", emoji: "☠️", id: 4 },
]
```

## Исправленные стили

### 1. Layout.tsx
- Исправлена структура flex-контейнера
- Добавлены правильные размеры и overflow
- Устранена проблема с белым экраном внизу

### 2. Kanban.module.css
- Изменен `.trelloContainer` с `height: 100vh` на `min-height: 100vh`
- Добавлен `box-sizing: border-box`
- Создана структура с `.allBoardsContainer` и `.kanbanBoardsContainer`
- Добавлена адаптивность для мобильных устройств

### 3. Board.module.css
- Созданы специальные стили для All Tasks (`.allTasksBoard`)
- Добавлена сетка для задач в All Tasks (`.allTasksGrid`)
- Настроены стили для обычных досок (`.regularBoard`)
- Добавлены стили для пустых досок (`.emptyBoard`)
- Добавлена адаптивность

### 4. Структура отображения
```
┌─────────────────────────────────────────────────────────┐
│                      All Tasks                         │
│  [Task] [Task] [Task] [Task] [Task] [Task] [Task]      │
│  [Task] [Task] [Task] [Task] [Task] [Task] [Task]      │
└─────────────────────────────────────────────────────────┘

┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  Start  │ │Progress │ │ Victory │ │ Defeat  │
│ [Task]  │ │ [Task]  │ │ [Task]  │ │ [Task]  │
│ [Task]  │ │ [Task]  │ │ [Task]  │ │ [Task]  │
│  ...    │ │  ...    │ │  ...    │ │  ...    │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

## Как работает drag and drop

1. **Создание задачи** - новые задачи создаются с `boardId: 0` и попадают в All Tasks
2. **Перетаскивание** - пользователь может перетащить любую задачу на любую доску
3. **Визуальная обратная связь** - доски подсвечиваются при наведении перетаскиваемой задачи
4. **DragOverlay** - показывает полупрозрачную копию перетаскиваемой задачи
5. **Обновление состояния** - при завершении перетаскивания задача перемещается в новую доску

## Технические детали

### Основные компоненты:
- `Kanban.tsx` - главный компонент с DndContext
- `Board.tsx` - компонент доски (droppable зона)
- `TaskCard.tsx` - большие карточки для All Tasks (draggable)
- `SmallTaskCard.tsx` - маленькие карточки для остальных досок (draggable)

### Store:
- `useBoardsStore` - управление досками
- `useTasksStore` - управление задачами с функцией `moveTask`

### Стили:
- Все стили адаптивные и поддерживают мобильные устройства
- Используется CSS Grid для All Tasks и Flexbox для остальных досок
- Добавлены hover-эффекты и transitions

## Запуск проекта

```bash
npm install
npm run dev
```

Проект будет доступен по адресу `http://localhost:5175/`

## Новая логика определения карточек по доскам

### Система поражений и побед

#### 1. Автоматическое перемещение просроченных задач
- **Функция `checkExpiredTasks`** в `storeTasks.ts` автоматически перемещает просроченные задачи в доску **Defeat (ID: 4)**
- **Хук `useExpiredTasksChecker`** проверяет просроченные задачи каждые 30 секунд
- **Награды обнуляются** при автоматическом перемещении в defeat

#### 2. Ручное перемещение в defeat
- При **drag & drop** в доску **Defeat (ID: 4)** → награды **обнуляются**
- При перемещении **из Defeat** в другие доски → награды **остаются нулевыми**

#### 3. Визуальное определение карточек по доскам

**В TaskCard.tsx и SmallTaskCard.tsx:**
```typescript
className={`${styles.taskCard} ${boardId === 4 ? styles.defeat : ""} ${boardId === 3 ? styles.victory : ""}`}
```

**Логика определения:**
- `boardId === 4` → применяется класс `.defeat` (поврежденные стили)
- `boardId === 3` → применяется класс `.victory` (победные стили)
- Остальные доски → обычные стили

#### 4. Стили поражений (Defeat)
- **Наклон карточки** (-2° для больших, -1° для маленьких)
- **Черно-белый фильтр** (grayscale + brightness)
- **Плавающий череп** 💀 с анимацией
- **Мерцающий эффект** повреждения
- **Зачеркнутый текст** (line-through)
- **Темные цвета** (wood-700, wood-800)

#### 5. Стили побед (Victory)
- **Золотой градиент** фона
- **Плавающая корона** 👑 с анимацией
- **Мерцающий золотой эффект**
- **Повышенная яркость** и насыщенность
- **Легкий наклон** (1° для больших, 0.5° для маленьких)
- **Золотые тени** и подсветка

#### 6. Прогресс-бар с процентами
- **Отображается только** для задач с `expiredDate`
- **Показывает процент** оставшегося времени (центрированный текст)
- **100% красный бар** для просроченных задач
- **Зеленый градиент** для активных задач
- **Автоматическое округление** до целых чисел

## Использование

1. Перейдите на страницу Kanban
2. Создайте новую задачу через страницу Create
3. Перетащите задачу из All Tasks в любую из 4 досок
4. Перетаскивайте задачи между досками для отслеживания прогресса
5. Перетащите задачу обратно в All Tasks при необходимости
6. **Просроченные задачи** автоматически попадают в Defeat с обнуленными наградами
7. **Завершенные задачи** в Victory получают золотые стили с короной