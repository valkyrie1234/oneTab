import { useEffect } from 'react';
import useTasksStore from '../store/storeTasks';

/**
 * Хук для автоматической проверки просроченных задач
 * Проверяет каждую минуту и помечает просроченные задачи
 */
const useExpiredTasksChecker = () => {
  const checkExpiredTasks = useTasksStore((state) => state.checkExpiredTasks);

  useEffect(() => {
    // Проверяем сразу при монтировании
    checkExpiredTasks();

    // Устанавливаем интервал для периодической проверки
    const interval = setInterval(() => {
      checkExpiredTasks();
    }, 60000); // Проверяем каждую минуту (не каждые 30 секунд!)

    // Очищаем интервал при размонтировании
    return () => {
      clearInterval(interval);
    };
  }, []); // Пустой массив - функция checkExpiredTasks стабильна в Zustand
};

export default useExpiredTasksChecker;

