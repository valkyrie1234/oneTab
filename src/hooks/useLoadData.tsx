import { useEffect, useRef, useCallback } from "react";
import useAuthStore from "../store/storeAuth";
import useBoardsStore, { type IBoard } from "../store/storeBoards";
import useTasksStore, { type ITasks } from "../store/storeTasks";
import { BoardsAPI, TasksAPI, UsersAPI } from "../api/client";
import type { IApiResponse, IUser } from "../api/types";

/**
 * Хук для загрузки данных с сервера при входе пользователя
 */
const useLoadData = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);
  const setBoards = useBoardsStore((state) => state.setBoards);
  const setTasks = useTasksStore((state) => state.setTasks);
  
  // Флаг для предотвращения повторных загрузок
  const hasLoadedRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const userId = user?.id;
    
    // Если пользователь не авторизован
    if (!isAuthenticated || !userId) {
      console.log("⚠️ Пользователь не авторизован, очищаем данные");
      setBoards([]);
      setTasks([]);
      hasLoadedRef.current = false;
      currentUserIdRef.current = null;
      return;
    }
    
    // Если данные уже загружены для этого пользователя, не загружаем снова
    if (hasLoadedRef.current && currentUserIdRef.current === userId) {
      console.log("✅ Данные уже загружены для пользователя:", userId);
      return;
    }
    
    // Если уже идет загрузка, не запускаем еще одну
    if (isLoadingRef.current) {
      console.log("⏳ Загрузка уже в процессе, пропускаем...");
      return;
    }
    
    console.log("🔄 useLoadData triggered для:", userId);
    
    const loadData = async () => {
      isLoadingRef.current = true;
      
      try {
        console.log("📥 Загрузка данных с сервера для пользователя:", user.username);

        // Загружаем профиль пользователя (актуальные XP, Gold, Level)
        const profileResponse = await UsersAPI.getProfile(userId) as IApiResponse<{ user: IUser }>;
        
        if (profileResponse.success) {
          console.log("✅ Профиль обновлен:", profileResponse.data.user);
          updateUser({
            xp: profileResponse.data.user.xp,
            gold: profileResponse.data.user.gold,
            level: profileResponse.data.user.level
          });
        } else {
          console.error("❌ Ошибка загрузки профиля:", profileResponse);
        }

        // Загружаем доски пользователя
        const boardsResponse = await BoardsAPI.getAll(userId) as IApiResponse<{ boards: IBoard[], total: number }>;
        
        if (boardsResponse.success) {
          console.log("✅ Доски загружены:", boardsResponse.data.boards.length);
          setBoards(boardsResponse.data.boards);
        } else {
          console.error("❌ Ошибка загрузки досок:", boardsResponse);
        }

        // Загружаем задачи пользователя
        const tasksResponse = await TasksAPI.getUserTasks(userId) as IApiResponse<{ tasks: ITasks[], total: number }>;
        
        if (tasksResponse.success) {
          console.log("✅ Задачи загружены:", tasksResponse.data.tasks.length);
          setTasks(tasksResponse.data.tasks);
        }
        
        // Помечаем, что данные загружены для этого пользователя
        hasLoadedRef.current = true;
        currentUserIdRef.current = userId;
        
      } catch (error) {
        console.error("❌ Ошибка загрузки данных:", error);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadData();
  }, [isAuthenticated, user?.id]); // Только userId, не весь объект user!
  
  // Функция для принудительного обновления данных
  const refreshData = useCallback(() => {
    hasLoadedRef.current = false;
  }, []);
  
  return { refreshData };
};

export default useLoadData;

