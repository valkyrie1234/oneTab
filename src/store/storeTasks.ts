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
  tasks: [],
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
              reward: { gold: 0, exp: 0 },
              isFailed: true,
            };
          }
          if (newBoardId === 3) {
            return { 
              ...task, 
              boardId: newBoardId,
              reward: { gold: 0, exp: 0 },
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
