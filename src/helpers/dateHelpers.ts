/**
 * Форматирует дату в формат hh:mm dd-mm-yy
 * @param date - дата для форматирования
 * @returns строка в формате "hh:mm dd-mm-yy"
 */
export const formatDateTime = (date: Date): string => {
  // Проверяем валидность даты
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    console.error('formatDateTime: Invalid date provided', date);
    return '-- --:-- --';
  }
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  
  return `${hours}:${minutes} ${day}-${month}-${year}`;
};

/**
 * Форматирует дату окончания задачи
 * @param date - дата окончания или null
 * @returns строка с датой или "Задание без времени"
 */
export const formatExpiredDate = (date: Date | null): string => {
  if (!date) {
    return "∞";
  }
  
  return formatDateTime(date);
};

/**
 * Форматирует время в относительном формате ("2 ч. назад", "3 дн. назад")
 * @param dateString - дата в формате ISO string
 * @returns строка с относительным временем
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Проверка валидности
  if (isNaN(diffMs) || diffMs < 0) {
    return 'только что';
  }
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins === 0) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays === 1) return 'вчера';
  return `${diffDays} дн. назад`;
};
