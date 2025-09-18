import React from "react";
import styles from "./SmallTaskCard.module.css";
import useReward from "../../hooks/useReward";
import Badge from "../../uiKit/Badge/Badge";
import DateBadge from "../../uiKit/DateBadge/DateBadge";
import ExpiredDateBadge from "../../uiKit/ExpiredDateBadge/ExpiredDateBadge";
import ProgressBar from "../../uiKit/ProgressBar/ProgressBar";
import { useDraggable } from "@dnd-kit/core";
import { ITasks } from "../../store/storeTasks";

const SmallTaskCard: React.FC<ITasks> = ({ title, id, reward, status, dateCreate, expiredDate, boardId }) => {
  const { setExp, setReward } = useReward();

  const { setNodeRef, listeners, attributes } = useDraggable({ id: id });
  
  const handleClick = () => {
    // Обработчик клика для будущих улучшений
  };

  return (
    <div 
      ref={setNodeRef} 
      {...listeners}
      {...attributes}
      className={`${styles.smallTaskCardContainer} ${boardId === 4 ? styles.defeat : ""} ${boardId === 3 ? styles.victory : ""}`}
      onClick={handleClick}
    >
      <div className={styles.smallTaskCardHeader}>
        <h4 className={styles.taskTitle}>{title}</h4>
        <Badge status={status || "easy"} />
      </div>
      <div className={styles.dateBadgesRow}>
        <DateBadge date={dateCreate} />
        <ExpiredDateBadge expiredDate={expiredDate} />
      </div>
      
      <div className={styles.smallTaskCardRewardBlock}>
        <div className={styles.rewardItem}>
          <span className={styles.rewardIcon}>{setReward(reward.gold)}</span>
          <span className={styles.rewardValue}>{reward.gold}</span>
        </div>
        <div className={styles.rewardItem}>
          <span className={styles.rewardIcon}>{setExp(reward.exp)}</span>
          <span className={styles.expValue}>{reward.exp}</span>
        </div>
      </div>
      
      <div className={styles.smallTaskCardActions}>
        <ProgressBar expiredDate={expiredDate} />
        <button 
          className={styles.cardDeleteButton}
          onClick={(e) => e.stopPropagation()}
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default SmallTaskCard;
