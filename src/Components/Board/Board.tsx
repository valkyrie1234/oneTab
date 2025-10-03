import React, { useMemo } from "react";
import styles from "./Board.module.css";
import { IBoard } from "../../store/storeBoards";
import useTasksStore from "../../store/storeTasks";
import usePagination from "../../hooks/usePagination";
import SmallTaskCard from "../SmallTaskCard/SmallTaskCard";
import TaskCard from "../TaskCard/TaskCard";
import { Pagination } from "../../uiKit/Pagination";
import { useDroppable } from "@dnd-kit/core";

const Board: React.FC<IBoard & { title?: string }> = ({ id, title, name, emoji }) => {
  const task = useTasksStore((state) => state.tasks);
  
  // Используем title (если передан) или name
  const boardName = title || name;

  // Для "all tasks" показываем только задачи БЕЗ доски (boardId === null или undefined)
  // Для остальных досок - фильтруем по boardId
  const filteredTAsk = useMemo(() => 
    boardName === 'all tasks' 
      ? task.filter((task) => !task.boardId || task.boardId === id)
      : task.filter((task) => task.boardId === id),
    [boardName, task, id]
  );

  // Настройки пагинации (для "all tasks" 5 карточек)
  const itemsPerPage = boardName === 'all tasks' ? 5 : 8;

  // Используем универсальный хук пагинации
  const {
    paginatedItems: paginatedTasks,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    resetPage
  } = usePagination(filteredTAsk, itemsPerPage);

  // Сбрасываем на первую страницу при изменении фильтра
  React.useEffect(() => {
    resetPage();
  }, [filteredTAsk.length, resetPage]);

  const { setNodeRef, isOver } = useDroppable({ 
    id: typeof id === 'string' ? id : String(id) 
  });

  const isAllTasks = boardName === 'all tasks';
  const className = `${styles.mainBoard} ${isAllTasks ? styles.allTasksBoard : ''} ${isOver ? styles.dragOver : ''}`;
  
  // Определяем CSS класс для доски по имени
  const getBoardClass = () => {
    switch(boardName) {
      case 'start': return styles.startBoard;
      case 'in progress': return styles.progressBoard;
      case 'victory': return styles.victoryBoard;
      case 'defeat': return styles.defeatBoard;
      default: return '';
    }
  };
  
  return (
    <div 
      ref={setNodeRef} 
      data-board-name={boardName}
      className={`${className} ${getBoardClass()}`}
    >
      <div className={styles.mainBoardHeader}>
        <p>{boardName}</p>
        <p>{emoji}</p>
      </div>

      <div className={isAllTasks ? styles.allTasksGrid : styles.regularBoard}>
        {filteredTAsk?.length > 0 ? (
          (isAllTasks ? paginatedTasks : filteredTAsk).map((task) => {
            // Для All Tasks показываем полные TaskCard, для остальных досок - SmallTaskCard
            if (isAllTasks) {
              return (
                <TaskCard
                  key={task.id}
                  {...task}
                  boardName={boardName}  // Передаем название доски
                />
              );
            } else {
              return (
                <SmallTaskCard
                  key={task.id}
                  {...task}
                  boardName={boardName}  // Передаем название доски
                />
              );
            }
          })
        ) : (
          <div className={styles.emptyBoard}>
            {isAllTasks ? "Нет задач" : "Перетащите задачу сюда"}
          </div>
        )}
      </div>

      {/* Пагинация только для All Tasks доски */}
      {isAllTasks && totalItems > itemsPerPage && (
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
  );
};

export default Board;
