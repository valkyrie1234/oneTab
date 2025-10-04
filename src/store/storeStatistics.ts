import { create } from "zustand";
import { UsersAPI } from "../api/client";
import { IApiResponse } from "../api/types";

export interface StatisticsData {
  totalUsers: number;
  newUsersChart: Array<{ date: string; count: number }>;
  activityData: Array<{ username: string; tasks: number }>;
  topUsersByLevel: Array<{
    username: string;
    level: number;
    xp: number;
    gold: number;
  }>;
  totalTasks: number;
  tasksChart: Array<{ date: string; count: number }>;
  avgTasksPerDay: number;
}

interface IStatisticsStore {
  statistics: StatisticsData | null;
  loading: boolean;
  error: string | null;
  fetchStatistics: () => Promise<void>;
  clearError: () => void;
}

const useStatisticsStore = create<IStatisticsStore>((set) => ({
  statistics: null,
  loading: false,
  error: null,

  fetchStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await UsersAPI.getAdminStatistics() as IApiResponse<StatisticsData>;
      
      if (response.success) {
        set({ statistics: response.data, loading: false });
      } else {
        set({ 
          error: response.error || "Ошибка загрузки статистики", 
          loading: false 
        });
      }
    } catch (err) {
      const error = err as Error;
      set({ 
        error: error.message || "Ошибка сети", 
        loading: false 
      });
      console.error("Error fetching statistics:", err);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useStatisticsStore;

