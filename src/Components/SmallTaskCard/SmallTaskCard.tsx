import React, { useState } from "react";
import styles from "./SmallTaskCard.module.css";
import useReward from "../../hooks/useReward";
import Badge from "../../uiKit/Badge/Badge";
import DateBadge from "../../uiKit/DateBadge/DateBadge";
import ExpiredDateBadge from "../../uiKit/ExpiredDateBadge/ExpiredDateBadge";
import ProgressBar from "../../uiKit/ProgressBar/ProgressBar";
import { useDraggable } from "@dnd-kit/core";
import useTasksStore, { ITasks } from "../../store/storeTasks";
import useNotificationStore from "../../store/storeNotifications";

interface SmallTaskCardProps extends ITasks {
  boardName?: string;
}

const SmallTaskCard: React.FC<SmallTaskCardProps> = ({ 
  title, 
  id, 
  rewardGold,
  rewardExp,
  difficulty,
  dateCreate, 
  expiredDate,
  boardName
}) => {
  const { setExp, setReward } = useReward();
  const { deleteTaskAsync } = useTasksStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [deleting, setDeleting] = useState(false);

  const { setNodeRef, listeners, attributes } = useDraggable({ 
    id: id ? (typeof id === 'string' ? id : String(id)) : 'temp-id'
  });
  
  // Проверяем, что id существует и является строкой
  if (!id) {
    console.error('SmallTaskCard: id is required');
    return null;
  }
  
  const handleClick = () => {
    // Обработчик клика для будущих улучшений
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (deleting) return;
    
    setDeleting(true);
    
    const success = await deleteTaskAsync(id);
    
    if (success) {
      addNotification("success", "Квест отменен!", "❌", 3000);
    } else {
      addNotification("error", "Не удалось отменить квест", "☠️", 4000);
      setDeleting(false);
    }
  };

  // Маппинг difficulty в старый формат для Badge (временно)
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
    if (!boardName) return styles.smallTaskCardContainer;
    
    switch(boardName) {
      case 'victory':
        return `${styles.smallTaskCardContainer} ${styles.victory}`;
      case 'defeat':
        return `${styles.smallTaskCardContainer} ${styles.defeat}`;
      case 'start':
        return `${styles.smallTaskCardContainer} ${styles.start}`;
      case 'in progress':
        return `${styles.smallTaskCardContainer} ${styles.progress}`;
      default:
        return styles.smallTaskCardContainer;
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={getBoardClassName()}
    >
      {/* Область для драга - вся карточка кроме кнопки */}
      <div 
        {...listeners}
        {...attributes}
        className={styles.dragHandle}
        onClick={handleClick}
      >
        <div className={styles.smallTaskCardHeader}>
          <h4 className={styles.taskTitle}>{title || 'Без названия'}</h4>
          <Badge status={statusMap[difficulty] || "easy"} />
        </div>
        <div className={styles.dateBadgesRow}>
          <DateBadge date={createDate} />
          <ExpiredDateBadge expiredDate={expiryDate} />
        </div>
        
        <div className={styles.smallTaskCardRewardBlock}>
          <div className={styles.rewardItem}>
            <span className={styles.rewardIcon}>{setReward(rewardGold || 0)}</span>
            <span className={styles.rewardValue}>{rewardGold || 0}</span>
          </div>
          <div className={styles.rewardItem}>
            <span className={styles.rewardIcon}>{setExp(rewardExp || 0)}</span>
            <span className={styles.expValue}>{rewardExp || 0}</span>
          </div>
        </div>
        
        <div className={styles.smallTaskCardActions}>
          <ProgressBar expiredDate={expiryDate} />
          {/* Кнопка удаления в футере */}
          <button 
            className={styles.cardDeleteButton}
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={deleting}
          >
            {deleting ? "⏳" : "❌"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmallTaskCard;
