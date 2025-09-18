import React from "react";
import styles from "./Board.module.css";
import { IBoard } from "../../store/storeBoards";
import useTasksStore from "../../store/storeTasks";
import SmallTaskCard from "../SmallTaskCard/SmallTaskCard";
import TaskCard from "../TaskCard/TaskCard";
import { useDroppable } from "@dnd-kit/core";

const Board: React.FC<IBoard> = ({ id, title, emoji }) => {
  const task = useTasksStore((state) => state.tasks);

  const filteredTAsk = task.filter((task) => task.boardId === id);

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
          filteredTAsk.map((task) => {
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
    </div>
  );
};

export default Board;
