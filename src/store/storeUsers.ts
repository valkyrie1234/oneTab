import { create } from "zustand";
import { UsersAPI } from "../api/client";
import type { IApiResponse } from "../api/types";

export interface IUserData {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  level: number;
  xp: number;
  gold: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
    boards: number;
  };
}

export interface IUsersStore {
  users: IUserData[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  setUsers: (users: IUserData[]) => void;
}

const useUsersStore = create<IUsersStore>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await UsersAPI.getAll() as IApiResponse<{ users: IUserData[], total: number }>;
      
      if (response.success) {
        set({ users: response.data.users, loading: false });
      } else {
        set({ error: response.error || "Ошибка загрузки пользователей", loading: false });
      }
    } catch (error) {
      set({ error: "Ошибка подключения к серверу", loading: false });
      console.error("Ошибка загрузки пользователей:", error);
    }
  },

  setUsers: (users: IUserData[]) => set({ users }),
}));

export default useUsersStore;

