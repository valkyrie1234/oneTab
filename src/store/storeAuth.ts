import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  level: number;
  xp: number;
  gold: number;
}

export interface IAuthStore {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: IUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (user: IUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<IUser>) => void;
}

const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setUser: (user: IUser) => set({ user, isAuthenticated: true }),

      setTokens: (accessToken: string, refreshToken: string) =>
        set({ accessToken, refreshToken }),

      login: (user: IUser, accessToken: string, refreshToken: string) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      updateUser: (updates: Partial<IUser>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "auth-storage", // Имя в localStorage
    }
  )
);

export default useAuthStore;

