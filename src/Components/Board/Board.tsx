import React, { useState, useMemo } from "react";
import styles from "./Board.module.css";
import { IBoard } from "../../store/storeBoards";
import useTasksStore from "../../store/storeTasks";
import SmallTaskCard from "../SmallTaskCard/SmallTaskCard";
import TaskCard from "../TaskCard/TaskCard";
import { Pagination } from "../../uiKit/Pagination";
import { useDroppable } from "@dnd-kit/core";

const Board: React.FC<IBoard & { title?: string }> = ({ id, title, name, emoji }) => {
  const task = useTasksStore((state) => state.tasks);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Используем title (если передан) или name
  const boardName = title || name;

  // Для "all tasks" показываем только задачи БЕЗ доски (boardId === null или undefined)
  // Для остальных досок - фильтруем по boardId
  const filteredTAsk = boardName === 'all tasks' 
    ? task.filter((task) => !task.boardId || task.boardId === id)
    : task.filter((task) => task.boardId === id);

  // Настройки пагинации (для "all tasks" 5 карточек)
  const itemsPerPage = boardName === 'all tasks' ? 5 : 8;
  const totalPages = Math.ceil(filteredTAsk.length / itemsPerPage);

  // Вычисляем задачи для текущей страницы
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTAsk.slice(startIndex, endIndex);
  }, [filteredTAsk, currentPage, itemsPerPage]);

  // Сбрасываем на первую страницу при изменении фильтра
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredTAsk.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      {isAllTasks && filteredTAsk.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredTAsk.length}
          showInfo={true}
        />
      )}
    </div>
  );
};

export default Board;
