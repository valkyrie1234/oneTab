import React from 'react';
import styles from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  showInfo?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
  showInfo = true
}) => {
  // Генерируем массив страниц для отображения
  const getVisiblePages = () => {
    const delta = 2; // Количество страниц по бокам от текущей
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.paginationContainer}>
      {showInfo && totalItems > 0 && (
        <div className={styles.paginationInfo}>
          <span className={styles.infoText}>
            Показано {startItem}-{endItem} из {totalItems} задач
          </span>
        </div>
      )}
      
      <div className={styles.pagination}>
        {/* Кнопка "Предыдущая" */}
        <button
          className={`${styles.paginationButton} ${styles.prevButton}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Предыдущая страница"
        >
          <span className={styles.buttonIcon}>←</span>
        </button>

        {/* Номера страниц */}
        <div className={styles.pageNumbers}>
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className={styles.dots}>...</span>
              ) : (
                <button
                  className={`${styles.pageButton} ${
                    page === currentPage ? styles.active : ''
                  }`}
                  onClick={() => onPageChange(page as number)}
                  aria-label={`Страница ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Кнопка "Следующая" */}
        <button
          className={`${styles.paginationButton} ${styles.nextButton}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Следующая страница"
        >
          <span className={styles.buttonIcon}>→</span>
        </button>
      </div>
    </div>
  );
};