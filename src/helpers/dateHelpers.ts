/**
 * Форматирует дату в формат hh:mm dd-mm-yy
 * @param date - дата для форматирования
 * @returns строка в формате "hh:mm dd-mm-yy"
 */
export const formatDateTime = (date: Date): string => {
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
