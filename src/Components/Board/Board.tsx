import React, { useState, useMemo } from "react";
import styles from "./Board.module.css";
import { IBoard } from "../../store/storeBoards";
import useTasksStore from "../../store/storeTasks";
import SmallTaskCard from "../SmallTaskCard/SmallTaskCard";
import TaskCard from "../TaskCard/TaskCard";
import { Pagination } from "../../uiKit/Pagination";
import { useDroppable } from "@dnd-kit/core";

const Board: React.FC<IBoard> = ({ id, title, emoji }) => {
  const task = useTasksStore((state) => state.tasks);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTAsk = task.filter((task) => task.boardId === id);

  // Настройки пагинации
  const itemsPerPage = id === 0 ? 5 : 8; // Для All Tasks 5 карточек на странице
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

  const { setNodeRef, isOver } = useDroppable({ id: id });

  const className = `${styles.mainBoard} ${id === 0 ? styles.allTasksBoard : ''} ${isOver ? styles.dragOver : ''}`;
  
  return (
    <div 
      ref={setNodeRef} 
      data-board-id={id}
      className={className}
    >
      <div className={styles.mainBoardHeader}>
        <p>{title}</p>
        <p>{emoji}</p>
      </div>

      <div className={id === 0 ? styles.allTasksGrid : styles.regularBoard}>
        {filteredTAsk?.length > 0 ? (
          paginatedTasks.map((task) => {
            // Для All Tasks показываем полные TaskCard, для остальных досок - SmallTaskCard
            if (id === 0) {
              return (
                <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description || ""}
                status={task.status || "easy"}
                reward={task.reward}
                dateCreate={task.dateCreate}
                expiredDate={task.expiredDate}
                boardId={task.boardId}
                isCompleted={task.isCompleted}
                isFailed={task.isFailed}
                />
              );
            } else {
              return (
                <SmallTaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description || ""}
                  status={task.status || "easy"}
                  boardId={task.boardId}
                  reward={task.reward}
                  dateCreate={task.dateCreate}
                  expiredDate={task.expiredDate}
                  isCompleted={task.isCompleted}
                  isFailed={task.isFailed}
                />
              );
            }
          })
        ) : (
          <div className={styles.emptyBoard}>
            {id === 0 ? "Нет задач" : "Перетащите задачу сюда"}
          </div>
        )}
      </div>

      {/* Пагинация только для All Tasks доски */}
      {id === 0 && filteredTAsk.length > itemsPerPage && (
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
