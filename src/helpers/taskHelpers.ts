import { ITasks } from "../store/storeTasks";

/**
 * Интерфейс статистики задач
 */
export interface TaskStats {
  victories: number;    // Завершенные задачи
  defeats: number;      // Проваленные задачи
  total: number;        // Всего задач
  active: number;       // Активные задачи
  completionRate: number; // Процент завершения
}

/**
 * Вычисляет статистику по задачам
 * @param tasks - массив задач
 * @returns объект со статистикой
 */
export const calculateTaskStats = (tasks: ITasks[]): TaskStats => {
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const failedTasks = tasks.filter(t => t.isFailed).length;
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => !t.isCompleted && !t.isFailed).length;
  
  // Процент завершения (от всех задач)
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  return {
    victories: completedTasks,
    defeats: failedTasks,
    total: totalTasks,
    active: activeTasks,
    completionRate
  };
};

/**
 * Получает последние завершенные/проваленные задачи
 * @param tasks - массив задач
 * @param limit - количество задач для возврата
 * @returns отсортированный массив последних задач
 */
export const getRecentActivity = (tasks: ITasks[], limit = 5): ITasks[] => {
  return tasks
    .filter(t => t.isCompleted || t.isFailed)
    .sort((a, b) => {
      const dateA = a.completedAt || a.updatedAt;
      const dateB = b.completedAt || b.updatedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, limit);
};

/**
 * Фильтрует задачи по статусу
 * @param tasks - массив задач
 * @param status - статус для фильтрации
 * @returns отфильтрованный массив задач
 */
export const filterTasksByStatus = (
  tasks: ITasks[], 
  status: 'completed' | 'failed' | 'active'
): ITasks[] => {
  switch (status) {
    case 'completed':
      return tasks.filter(t => t.isCompleted);
    case 'failed':
      return tasks.filter(t => t.isFailed);
    case 'active':
      return tasks.filter(t => !t.isCompleted && !t.isFailed);
    default:
      return tasks;
  }
};

/**
 * Получить последнюю созданную активную задачу
 * @param tasks - массив задач
 * @returns последняя созданная активная задача или null
 */
export const getLastCreatedTask = (tasks: ITasks[]): ITasks | null => {
  if (tasks.length === 0) return null;
  
  const activeTasks = tasks.filter(task => !task.isCompleted && !task.isFailed);
  
  if (activeTasks.length === 0) return null;
  
  return activeTasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
};
