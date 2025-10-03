import { useEffect } from "react";
import useAuthStore from "../store/storeAuth";
import useBoardsStore, { type IBoard } from "../store/storeBoards";
import useTasksStore, { type ITasks } from "../store/storeTasks";
import { BoardsAPI, TasksAPI } from "../api/client";
import type { IApiResponse } from "../api/types";

/**
 * Хук для загрузки данных с сервера при входе пользователя
 */
const useLoadData = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setBoards = useBoardsStore((state) => state.setBoards);
  const setTasks = useTasksStore((state) => state.setTasks);

  useEffect(() => {
    console.log("🔄 useLoadData triggered:", { isAuthenticated, user: user?.username });
    
    const loadData = async () => {
      if (!isAuthenticated || !user) {
        console.log("⚠️ Пользователь не авторизован, очищаем данные");
        setBoards([]);
        setTasks([]);
        return;
      }

      try {
        console.log("📥 Загрузка данных с сервера для пользователя:", user.username);

        // Загружаем доски пользователя
        const boardsResponse = await BoardsAPI.getAll(user.id) as IApiResponse<{ boards: IBoard[], total: number }>;
        
        if (boardsResponse.success) {
          console.log("✅ Доски загружены:", boardsResponse.data.boards.length);
          console.log("📋 Доски данные:", boardsResponse.data.boards);
          setBoards(boardsResponse.data.boards);
        } else {
          console.error("❌ Ошибка загрузки досок:", boardsResponse);
        }

        // Загружаем задачи пользователя
        const tasksResponse = await TasksAPI.getUserTasks(user.id) as IApiResponse<{ tasks: ITasks[], total: number }>;
        
        if (tasksResponse.success) {
          console.log("✅ Задачи загружены:", tasksResponse.data.tasks.length);
          setTasks(tasksResponse.data.tasks);
        }
      } catch (error) {
        console.error("❌ Ошибка загрузки данных:", error);
      }
    };

    loadData();
  }, [isAuthenticated, user, setBoards, setTasks]);
};

export default useLoadData;

