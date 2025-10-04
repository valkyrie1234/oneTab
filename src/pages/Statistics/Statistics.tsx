import React, { useEffect, useMemo } from 'react';
import useStatisticsStore from '../../store/storeStatistics';
import usePagination from '../../hooks/usePagination';
import { Pagination } from '../../uiKit/Pagination';
import { createChartsConfig, ChartConfig } from '../../config/chartsConfig';
import styles from './Statistics.module.css';

const Statistics: React.FC = () => {
  const { statistics, loading, error, fetchStatistics } = useStatisticsStore();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Создаем массив графиков для пагинации
  const chartsData = useMemo((): ChartConfig[] => {
    if (!statistics) return [];
    return createChartsConfig(statistics);
  }, [statistics]);

  // Используем пагинацию для графиков
  const {
    paginatedItems: paginatedCharts,
    currentPage,
    totalPages,
    goToPage
  } = usePagination(chartsData, 3);

  if (loading) {
    return (
      <div className={styles.statisticsPage}>
        <div className={styles.loadingState}>
          <div className={styles.loadingIcon}>📊</div>
          <p>Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statisticsPage}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>❌</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!statistics) return null;

  return (
    <div className={styles.statisticsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📊 Статистика системы</h1>
        <p className={styles.pageSubtitle}>Аналитика и метрики</p>
      </div>

      {/* Карточки со счетчиками */}
      <div className={styles.statsCards}>
        <div className={styles.statsCard}>
          <div className={styles.cardIcon}>👥</div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>{statistics.totalUsers}</div>
            <div className={styles.cardLabel}>Всего пользователей</div>
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.cardIcon}>📋</div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>{statistics.totalTasks}</div>
            <div className={styles.cardLabel}>Всего задач</div>
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.cardIcon}>📈</div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>{statistics.avgTasksPerDay}</div>
            <div className={styles.cardLabel}>Задач в день (среднее)</div>
          </div>
        </div>
      </div>

      {/* Графики с пагинацией */}
      <div className={styles.chartsSection}>
        <div className={styles.chartsGrid}>
          {paginatedCharts.map((chart) => (
            <div key={chart.id} className={styles.chartCard}>
              <h3 className={styles.chartTitle}>{chart.title}</h3>
              {chart.component}
            </div>
          ))}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            itemsPerPage={3}
            totalItems={chartsData.length}
            showInfo={true}
          />
        )}
      </div>
    </div>
  );
};

export default Statistics;
