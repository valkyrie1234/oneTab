import { useMemo } from "react";
import { TaskExpiryResult } from "./useTaskExpiryTypes";

/**
 * Хук для определения времени до окончания задачи
 * @param expiredDate - дата окончания задачи или null
 * @returns объект с информацией о времени до окончания или null
 */
const useTaskExpiry = (expiredDate: Date | null): TaskExpiryResult => {
  return useMemo(() => {
    // Если дата окончания не указана, возвращаем null
    if (!expiredDate) {
      return null;
    }

    // Проверяем валидность даты
    if (!(expiredDate instanceof Date) || isNaN(expiredDate.getTime())) {
      console.error('useTaskExpiry: Invalid date provided', expiredDate);
      return null;
    }

    const now = new Date();
    const timeDiff = expiredDate.getTime() - now.getTime();

    // Если время уже прошло
    if (timeDiff <= 0) {
      return {
        isExpired: true,
        timeLeft: 0,
        formattedTime: "Время истекло",
        daysLeft: 0,
        hoursLeft: 0,
        minutesLeft: 0,
      };
    }

    // Вычисляем компоненты времени
    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    // Форматируем время в читаемый вид
    let formattedTime = "";
    
    if (daysLeft > 0) {
      formattedTime = `${daysLeft} дн. ${hoursLeft}ч ${minutesLeft}м`;
    } else if (hoursLeft > 0) {
      formattedTime = `${hoursLeft}ч ${minutesLeft}м`;
    } else if (minutesLeft > 0) {
      formattedTime = `${minutesLeft}м`;
    } else {
      formattedTime = "Менее минуты";
    }

    return {
      isExpired: false,
      timeLeft: timeDiff,
      formattedTime,
      daysLeft,
      hoursLeft,
      minutesLeft,
    };
  }, [expiredDate]);
};

export default useTaskExpiry;
