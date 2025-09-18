import React from "react";
import styles from "./TaskCard.module.css";
import Badge from "../../uiKit/Badge/Badge";
import DateBadge from "../../uiKit/DateBadge/DateBadge";
import ExpiredDateBadge from "../../uiKit/ExpiredDateBadge/ExpiredDateBadge";
import ProgressBar from "../../uiKit/ProgressBar/ProgressBar";
import { TaskCardProps } from "./types";
import RewardBar from "../RewardBar/RewardBar";
import { spliceTextHelper } from "./Helpers/SpliceTextHelper";
import useTasksStore from "../../store/storeTasks";
import { useDraggable } from "@dnd-kit/core";

const TaskCard: React.FC<TaskCardProps> = ({
  description,
  status,
  title,
  reward,
  id,
  dateCreate,
  expiredDate,
  boardId
}) => {
  const { deleteTask } = useTasksStore();

  const { setNodeRef, listeners, attributes } = useDraggable({ id: id.toString() });
  
  const handleClick = () => {
    // Обработчик клика для будущих улучшений
  };

  return (
    <div 
      ref={setNodeRef} 
      {...listeners}
      {...attributes}
      className={`${styles.taskCard} ${boardId === 4 ? styles.defeat : ""} ${boardId === 3 ? styles.victory : ""}`}
      onClick={handleClick}
    >
      <div className={styles.taskCardHeader}>
        <p>{title}</p>
        <Badge status={status} />
      </div>
      <div className={styles.dateBadgesRow}>
        <DateBadge date={dateCreate} />
        <ExpiredDateBadge expiredDate={expiredDate} />
      </div>
      <RewardBar exp={reward.exp} gold={reward.gold} />
      <div className={styles.cardContent}>{spliceTextHelper(description)}</div>
      <div className={styles.cardActions}>
        <ProgressBar expiredDate={expiredDate} />
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(id);
          }}
          className={styles.cardDeleteButton}
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
