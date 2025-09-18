import { useMemo } from "react";

/**
 * Хук для расчета системы уровней на основе опыта
 * @param totalExp - общий опыт пользователя
 * @returns объект с данными о текущем уровне и прогрессе
 */
const useLevelSystem = (totalExp: number) => {
  return useMemo(() => {
    // Инициализация переменных для расчета уровня
    let level = 0;                    // Текущий уровень пользователя
    let expToNextLevel = 150;         // Опыт, необходимый для достижения следующего уровня
    let expForCurrentLevel = 0;       // Опыт, потраченный на достижение текущего уровня
    let remainingExp = totalExp;      // Оставшийся опыт после распределения по уровням
    let expNeededForNextLevel = expToNextLevel; // Опыт, нужный для следующего уровня

    // Основной цикл для распределения опыта по уровням
    // Продолжаем, пока у нас достаточно опыта для повышения уровня
    while (remainingExp >= expToNextLevel) {
      remainingExp -= expToNextLevel;     // Вычитаем опыт, потраченный на уровень
      expForCurrentLevel = expToNextLevel; // Запоминаем, сколько опыта ушло на текущий уровень
      level++;                            // Повышаем уровень

      // Система прогрессивного увеличения требований к опыту
      if (level === 1) {
        expToNextLevel = 300;            // Для 1 уровня нужно 300 опыта
      } else if (level === 2) {
        expToNextLevel = 500;            // Для 2 уровня нужно 500 опыта
      } else {
        // Для всех последующих уровней увеличиваем требование на 200 опыта
        expToNextLevel += 200;
      }
    }

    // Опыт, накопленный на текущем уровне (оставшийся после распределения)
    const currentLevelExp = remainingExp;

    // Обновляем общее требование для следующего уровня
    expNeededForNextLevel = expToNextLevel;

    // Возвращаем объект с полной информацией о прогрессе
    return {
      level,                                    // Текущий уровень
      currentLevelExp,                          // Опыт на текущем уровне
      expNeededForNextLevel,                    // Общий опыт, нужный для следующего уровня
      expToNextLevel: expToNextLevel - currentLevelExp, // Опыт, остающийся до следующего уровня
      expForCurrentLevel: expForCurrentLevel + currentLevelExp, // Общий опыт текущего уровня
      totalExpToNextLevel: expToNextLevel,      // Полное требование для следующего уровня
    };
  }, [totalExp]); // Пересчитываем только при изменении общего опыта
};

export default useLevelSystem;
