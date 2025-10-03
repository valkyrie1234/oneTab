import React, { useState } from "react";
import styles from "./TaskCard.module.css";
import Badge from "../../uiKit/Badge/Badge";
import DateBadge from "../../uiKit/DateBadge/DateBadge";
import ExpiredDateBadge from "../../uiKit/ExpiredDateBadge/ExpiredDateBadge";
import ProgressBar from "../../uiKit/ProgressBar/ProgressBar";
import RewardBar from "../RewardBar/RewardBar";
import { spliceTextHelper } from "./Helpers/SpliceTextHelper";
import useTasksStore, { ITasks } from "../../store/storeTasks";
import useNotificationStore from "../../store/storeNotifications";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps extends ITasks {
  boardName?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  description,
  difficulty,
  title,
  rewardExp,
  rewardGold,
  id,
  dateCreate,
  expiredDate,
  boardName
}) => {
  const { deleteTaskAsync } = useTasksStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [deleting, setDeleting] = useState(false);

  const { setNodeRef, listeners, attributes } = useDraggable({ 
    id: id ? (typeof id === 'string' ? id : String(id)) : 'temp-id'
  });

  // Проверяем, что id существует и является строкой
  if (!id) {
    console.error('TaskCard: id is required');
    return null;
  }
  
  const handleClick = () => {
    // Обработчик клика для будущих улучшений
  };

  // Маппинг difficulty в старый формат для Badge
  const statusMap = {
    'EASY': 'easy',
    'MEDIUM': 'medium',
    'HARD': 'hard',
    'EPIC': 'epic',
    'COMPLETED': 'completed'
  } as const;

  // Безопасное создание даты
  const createDate = dateCreate ? new Date(dateCreate) : new Date();
  const expiryDate = expiredDate ? new Date(expiredDate) : null;

  // Определяем CSS класс в зависимости от доски
  const getBoardClassName = () => {
    if (!boardName) return styles.taskCard;
    
    switch(boardName) {
      case 'victory':
        return `${styles.taskCard} ${styles.victory}`;
      case 'defeat':
        return `${styles.taskCard} ${styles.defeat}`;
      default:
        return styles.taskCard;
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      {...listeners}
      {...attributes}
      className={getBoardClassName()}
      onClick={handleClick}
    >
      <div className={styles.taskCardHeader}>
        <p>{title || 'Без названия'}</p>
        <Badge status={statusMap[difficulty] || "easy"} />
      </div>
      <div className={styles.dateBadgesRow}>
        <DateBadge date={createDate} />
        <ExpiredDateBadge expiredDate={expiryDate} />
      </div>
      <RewardBar exp={rewardExp || 0} gold={rewardGold || 0} />
      <div className={styles.cardContent}>{spliceTextHelper(description || "")}</div>
      <div className={styles.cardActions}>
        <ProgressBar expiredDate={expiryDate} />
        <button
          onClick={async (e) => {
            e.stopPropagation();
            
            if (deleting) return;
            
            setDeleting(true);
            
            const success = await deleteTaskAsync(id);
            
            if (success) {
              addNotification("success", "Квест удален!", "❌", 3000);
            } else {
              addNotification("error", "Не удалось удалить квест", "☠️", 4000);
              setDeleting(false);
            }
          }}
          className={styles.cardDeleteButton}
          disabled={deleting}
        >
          {deleting ? "⏳" : "❌"}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
