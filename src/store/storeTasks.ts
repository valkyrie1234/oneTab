import { create } from "zustand";
import { DifficultyStatus } from "../Consts/status";

export interface ITasks {
  id: string;
  title: string;
  description?: string;
  status?: DifficultyStatus;
  dateCreate: Date;
  expiredDate: Date | null;
  boardId: number; // 0 = All Tasks, 1-4 = другие доски
  reward: {
    gold: number;
    exp: number;
  };
}

export interface ITasksStore {
  tasks: ITasks[];
  createTask: (task: ITasks) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newBoardId: number) => void;
  checkExpiredTasks: () => void;
}

const useTasksStore = create<ITasksStore>((set) => ({
  tasks: [
    // Задача без дедлайна (прогресс-бар не должен показываться)
    {
      id: "1",
      title: "Изучить React",
      description: "Изучить основы React и компоненты",
      status: "easy",
      boardId: 0,
      reward: { gold: 100, exp: 50 },
      dateCreate: new Date(),
      expiredDate: null,
    },
    // Задача с просроченным дедлайном (100% красный бар)
    {
      id: "2",
      title: "Просроченная задача",
      description: "Эта задача уже просрочена - красный бар 100%",
      status: "medium",
      boardId: 0,
      reward: { gold: 200, exp: 100 },
      dateCreate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
      expiredDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 день назад
    },
    // Задача с дедлайном через 6 дней (85% зеленый бар)
    {
      id: "3",
      title: "Задача на 6 дней",
      description: "Дедлайн через 6 дней - зеленый бар 85%",
      status: "easy",
      boardId: 0,
      reward: { gold: 150, exp: 75 },
      dateCreate: new Date(),
      expiredDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // +6 дней
    },
    // Задача с дедлайном через 3 дня (43% зеленый бар)
    {
      id: "4",
      title: "Задача на 3 дня",
      description: "Дедлайн через 3 дня - зеленый бар 43%",
      status: "medium",
      boardId: 0,
      reward: { gold: 300, exp: 150 },
      dateCreate: new Date(),
      expiredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 дня
    },
    // Задача с дедлайном через 1 день (14% зеленый бар)
    {
      id: "5",
      title: "Срочная задача",
      description: "Дедлайн завтра - зеленый бар 14%",
      status: "hard",
      boardId: 0,
      reward: { gold: 400, exp: 200 },
      dateCreate: new Date(),
      expiredDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // +1 день
    },
    // Задача с дедлайном через 12 часов (7% зеленый бар)
    {
      id: "6",
      title: "Очень срочная задача",
      description: "Дедлайн через 12 часов - зеленый бар 7%",
      status: "epic",
      boardId: 0,
      reward: { gold: 600, exp: 400 },
      dateCreate: new Date(),
      expiredDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // +12 часов
    },
    // Задача с дедлайном через 2 часа (1% зеленый бар)
    {
      id: "7",
      title: "Критическая задача",
      description: "Дедлайн через 2 часа - зеленый бар 1%",
      status: "epic",
      boardId: 0,
      reward: { gold: 800, exp: 500 },
      dateCreate: new Date(),
      expiredDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2 часа
    },
        // Тестовая задача в victory доске (золотая корона)
        {
          id: "8",
          title: "Завершенная задача",
          description: "Эта задача уже выполнена - золотая корона 👑",
          status: "completed",
          boardId: 3,
          reward: { gold: 1000, exp: 600 },
          dateCreate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 дня назад
          expiredDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // +1 день
        },
        // Тестовые задачи для Start доски (ID: 1)
        {
          id: "9",
          title: "Новая задача",
          description: "Тестовая задача на доске Start",
          status: "easy",
          boardId: 1,
          reward: { gold: 100, exp: 50 },
          dateCreate: new Date(),
          expiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 дней
        },
        {
          id: "10",
          title: "Еще одна задача",
          description: "Вторая тестовая задача на доске Start",
          status: "medium",
          boardId: 1,
          reward: { gold: 200, exp: 100 },
          dateCreate: new Date(),
          expiredDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 дней
        },
        // Тестовые задачи для In Progress доски (ID: 2)
        {
          id: "11",
          title: "Задача в работе",
          description: "Тестовая задача на доске In Progress",
          status: "hard",
          boardId: 2,
          reward: { gold: 300, exp: 150 },
          dateCreate: new Date(),
          expiredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 дня
        },
        {
          id: "12",
          title: "Активная задача",
          description: "Вторая тестовая задача на доске In Progress",
          status: "epic",
          boardId: 2,
          reward: { gold: 400, exp: 200 },
          dateCreate: new Date(),
          expiredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 дня
        },
  ],
  createTask: (task: ITasks) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  deleteTask: (id: string) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  moveTask: (taskId, newBoardId) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => {
        if (task.id === taskId) {
          // Если перемещаем в defeat (ID: 4), обнуляем награды
          if (newBoardId === 4) {
            return { 
              ...task, 
              boardId: newBoardId,
              reward: { gold: 0, exp: 0 }
            };
          }
          return { ...task, boardId: newBoardId };
        }
        return task;
      });
      return { tasks: updatedTasks };
    });
  },
  checkExpiredTasks: () => {
    set((state) => {
      const now = new Date();
      const updatedTasks = state.tasks.map((task) => {
        // Проверяем, просрочена ли задача и не находится ли уже в defeat
        if (task.expiredDate && 
            task.expiredDate <= now && 
            task.boardId !== 4) {
          return {
            ...task,
            boardId: 4, // Перемещаем в defeat
            reward: { gold: 0, exp: 0 } // Обнуляем награды
          };
        }
        return task;
      });
      return { tasks: updatedTasks };
    });
  },
}));

export default useTasksStore;
