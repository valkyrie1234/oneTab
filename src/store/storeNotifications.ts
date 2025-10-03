import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface INotification {
  id: string;
  type: NotificationType;
  message: string;
  emoji?: string;
  duration?: number;
}

interface INotificationStore {
  notifications: INotification[];
  addNotification: (
    type: NotificationType,
    message: string,
    emoji?: string,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  
  // Хелперы для быстрого вызова
  success: (message: string, emoji?: string) => void;
  error: (message: string, emoji?: string) => void;
  info: (message: string, emoji?: string) => void;
}

const useNotificationStore = create<INotificationStore>((set) => ({
  notifications: [],

  addNotification: (type, message, emoji, duration = 4000) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: INotification = {
      id,
      type,
      message,
      emoji,
      duration,
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Автоматическое удаление через duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // Хелперы
  success: (message, emoji = "⚔️") =>
    set((state) => {
      state.addNotification("success", message, emoji);
      return state;
    }),

  error: (message, emoji = "☠️") =>
    set((state) => {
      state.addNotification("error", message, emoji);
      return state;
    }),

  info: (message, emoji = "📜") =>
    set((state) => {
      state.addNotification("info", message, emoji);
      return state;
    }),
}));

export default useNotificationStore;
