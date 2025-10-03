import { create } from "zustand";

// Типы сложности (соответствует бэкенду)
export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EPIC" | "COMPLETED";

export interface ITasks {
  id: string;
  title: string;
  description?: string;
  difficulty: Difficulty;  // Изменено с status на difficulty
  dateCreate: string;      // ISO string с бэкенда
  expiredDate: string | null;
  boardId: string | null;  // UUID доски (не number!)
  isCompleted: boolean;
  isFailed: boolean;
  rewardExp: number;       // Изменено с reward.exp
  rewardGold: number;      // Изменено с reward.gold
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface ITasksStore {
  tasks: ITasks[];
  setTasks: (tasks: ITasks[]) => void;  // Загрузка задач с сервера
  createTask: (task: ITasks) => void;
  deleteTask: (id: string) => void;  // Локальное удаление
  deleteTaskAsync: (id: string) => Promise<boolean>;  // Удаление с backend
  updateTask: (id: string, updates: Partial<ITasks>) => void;
  moveTask: (taskId: string, newBoardId: string) => Promise<void>;  // Async!
  checkExpiredTasks: () => void;
}

const useTasksStore = create<ITasksStore>((set) => ({
  tasks: [],  // Пустой массив - задачи загружаются с сервера
  
  setTasks: (tasks: ITasks[]) => set({ tasks }),
  createTask: (task: ITasks) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
    
  deleteTask: (id: string) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  
  deleteTaskAsync: async (id: string) => {
    // Импортируем внутри функции чтобы избежать циклических зависимостей
    const { TasksAPI } = await import('../api/client');
    
    try {
      const response = await TasksAPI.delete(id) as { success: boolean };
      
      if (response.success) {
        // Удаляем из store только после успешного удаления с backend
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
      return false;
    }
  },
    
  updateTask: (id: string, updates: Partial<ITasks>) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
    
  moveTask: async (taskId, newBoardId) => {
    // Оптимистичное обновление - сразу обновляем UI
    set((state) => {
      const updatedTasks = state.tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, boardId: newBoardId };
        }
        return task;
      });
      return { tasks: updatedTasks };
    });

    // Отправляем на backend (будет обработано в Kanban.tsx)
  },
  checkExpiredTasks: () => {
    set((state) => {
      const now = new Date().toISOString();
      const updatedTasks = state.tasks.map((task) => {
        // Проверка просроченных задач
        if (task.expiredDate && 
            task.expiredDate <= now && 
            !task.isFailed && 
            !task.isCompleted) {
          return {
            ...task,
            isFailed: true
          };
        }
        return task;
      });
      return { tasks: updatedTasks };
    });
  },
}));

export default useTasksStore;
