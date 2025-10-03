import React, { useEffect } from 'react';
import useUsersStore from '../../store/storeUsers';
import usePagination from '../../hooks/usePagination';
import { Pagination } from '../../uiKit/Pagination';
import { getRoleEmoji, getRoleBadgeClass } from '../../helpers/userHelpers';
import styles from './Users.module.css';

const Users: React.FC = () => {
  const { users, loading, error, fetchUsers } = useUsersStore();

  // Загрузка пользователей при монтировании
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Пагинация через универсальный хук
  const {
    paginatedItems: paginatedUsers,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(users, 3);

  return (
    <div className={styles.usersPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>👥 Управление пользователями</h1>
        <p className={styles.pageSubtitle}>Всего пользователей: {users.length}</p>
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingIcon}>⏳</div>
          <p>Загрузка пользователей...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>❌</div>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.pageContent}>
          {/* Таблица пользователей */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>👤 Пользователь</div>
              <div className={styles.headerCell}>🎯 Уровень</div>
              <div className={styles.headerCell}>🎭 Роль</div>
              <div className={styles.headerCell}>📋 Задачи</div>
              <div className={styles.headerCell}>📊 Доски</div>
            </div>
            
            <div className={styles.tableBody}>
              {paginatedUsers.map((user) => (
                <div key={user.id} className={styles.userRow}>
                  <div className={styles.userCell}>
                    <div className={styles.userAvatar}>
                      {getRoleEmoji(user.role)}
                    </div>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{user.username}</div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                  </div>
                  
                  <div className={styles.levelCell}>
                    <span className={styles.levelValue}>{user.level}</span>
                    <div className={styles.levelResources}>
                      <span>💰 {user.gold}</span>
                      <span>⭐ {user.xp}</span>
                    </div>
                  </div>
                  
                  <div className={styles.roleCell}>
                    <div className={`${styles.roleBadge} ${getRoleBadgeClass(user.role, styles)}`}>
                      {user.role}
                    </div>
                  </div>
                  
                  <div className={styles.countCell}>
                    {user._count?.tasks || 0}
                  </div>
                  
                  <div className={styles.countCell}>
                    {user._count?.boards || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Пагинация */}
          {totalItems > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              showInfo={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Users;

