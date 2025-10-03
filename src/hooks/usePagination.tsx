import { useState, useMemo } from 'react';

/**
 * Универсальный хук для пагинации
 * @param items - массив элементов для пагинации
 * @param itemsPerPage - количество элементов на странице
 * @returns объект с данными пагинации и методами управления
 */
function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Вычисляем элементы для текущей страницы
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Переход на страницу
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Следующая страница
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Предыдущая страница
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Сброс на первую страницу (полезно при фильтрации)
  const resetPage = () => {
    setCurrentPage(1);
  };

  // Проверки
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Диапазон элементов на текущей странице
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, items.length);

  return {
    // Данные
    paginatedItems,
    currentPage,
    totalPages,
    totalItems: items.length,
    itemsPerPage,
    startIndex,
    endIndex,
    
    // Проверки
    hasNextPage,
    hasPrevPage,
    
    // Методы
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    setCurrentPage,
  };
}

export default usePagination;

