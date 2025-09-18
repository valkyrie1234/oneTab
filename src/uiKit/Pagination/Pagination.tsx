import React, { useState } from "react";

import styles from "./Pagination.module.css";
import classNames from "classnames";

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange(page);
  };

  // Генерация диапазона страниц
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Максимальное видимых номеров

    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className={styles.paginationContainer}>
      {/* Кнопка "Назад" */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pixelButtonStyle}
      >
        ◀
      </button>

      {/* Номера страниц */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={classNames([
            styles.pixelButtonStyle,
            {
              [styles.active]: page === currentPage,
            },
          ])}
        >
          {page}
        </button>
      ))}

      {/* Кнопка "Вперед" */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pixelButtonStyle}
      >
        ▶
      </button>
    </div>
  );
};

export default Pagination;
