import { useEffect } from 'react';
import useTasksStore from '../store/storeTasks';

/**
 * Хук для автоматической проверки просроченных задач
 * Проверяет каждые 30 секунд и перемещает просроченные задачи в defeat
 */
const useExpiredTasksChecker = () => {
  const { checkExpiredTasks } = useTasksStore();

  useEffect(() => {
    // Проверяем сразу при монтировании
    checkExpiredTasks();

    // Устанавливаем интервал для периодической проверки
    const interval = setInterval(() => {
      checkExpiredTasks();
    }, 30000); // Проверяем каждые 30 секунд

    // Очищаем интервал при размонтировании
    return () => {
      clearInterval(interval);
    };
  }, [checkExpiredTasks]);
};

export default useExpiredTasksChecker;

