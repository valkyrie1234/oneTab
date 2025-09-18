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
  isCompleted: boolean;
  isFailed: boolean;
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
    // Моковые задачи для тестирования пагинации
    {
      id: "1",
      title: "Изучить React Hooks",
      description: "Изучить все хуки React и их применение в проектах",
      status: "easy",
      dateCreate: new Date("2024-01-15T10:00:00"),
      expiredDate: null,
      boardId: 0,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 100, exp: 50 }
    },
    {
      id: "2", 
      title: "Создать компонент TaskCard",
      description: "Разработать компонент карточки задачи с анимациями",
      status: "medium",
      dateCreate: new Date("2024-01-16T14:30:00"),
      expiredDate: null,
      boardId: 0,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 200, exp: 100 }
    },
    {
      id: "3",
      title: "Настроить TypeScript",
      description: "Настроить строгую типизацию для всего проекта",
      status: "hard",
      dateCreate: new Date("2024-01-17T09:15:00"),
      expiredDate: null,
      boardId: 0,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 300, exp: 150 }
    },
    {
      id: "4",
      title: "Создать систему авторизации",
      description: "Реализовать JWT авторизацию с refresh токенами",
      status: "hard",
      dateCreate: new Date("2024-01-18T11:45:00"),
      expiredDate: null,
      boardId: 0,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 500, exp: 250 }
    },
    {
      id: "5",
      title: "Написать тесты",
      description: "Покрыть проект unit и integration тестами",
      status: "medium",
      dateCreate: new Date("2024-01-19T16:20:00"),
      expiredDate: null,
      boardId: 0,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 250, exp: 125 }
    },
    {
      id: "6",
      title: "Оптимизировать производительность",
      description: "Оптимизировать рендеринг и загрузку приложения",
      status: "hard",
      dateCreate: new Date("2024-01-20T13:10:00"),
      expiredDate: null,
      boardId: 0,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 400, exp: 200 }
    },
    {
      id: "7",
      title: "Создать документацию",
      description: "Написать подробную документацию для API и компонентов",
      status: "easy",
      dateCreate: new Date("2024-01-21T08:30:00"),
      expiredDate: null,
      boardId: 1,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 150, exp: 75 }
    },
    {
      id: "11",
      title: "Тестовая задача Start",
      description: "Задача для тестирования доски Start",
      status: "medium",
      dateCreate: new Date("2024-01-25T10:00:00"),
      expiredDate: null,
      boardId: 1,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 180, exp: 90 }
    },
    {
      id: "8",
      title: "Настроить CI/CD",
      description: "Настроить автоматическое тестирование и деплой",
      status: "hard",
      dateCreate: new Date("2024-01-22T10:15:00"),
      expiredDate: null,
      boardId: 2,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 600, exp: 300 }
    },
    {
      id: "12",
      title: "Тестовая задача In Progress",
      description: "Задача для тестирования доски In Progress",
      status: "hard",
      dateCreate: new Date("2024-01-26T14:00:00"),
      expiredDate: null,
      boardId: 2,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 250, exp: 125 }
    },
    {
      id: "9",
      title: "Создать админ панель",
      description: "Разработать интерфейс для администраторов",
      status: "hard",
      dateCreate: new Date("2024-01-23T15:45:00"),
      expiredDate: null,
      boardId: 3,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 800, exp: 400 }
    },
    {
      id: "10",
      title: "Добавить уведомления",
      description: "Реализовать систему push-уведомлений",
      status: "medium",
      dateCreate: new Date("2024-01-24T12:00:00"),
      expiredDate: null,
      boardId: 4,
      isCompleted: false,
      isFailed: false,
      reward: { gold: 350, exp: 175 }
    }
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
              isFailed: true,
            };
          }
          if (newBoardId === 3) {
            return { 
              ...task, 
              boardId: newBoardId,
              isFailed: false,
              isCompleted: true,
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
