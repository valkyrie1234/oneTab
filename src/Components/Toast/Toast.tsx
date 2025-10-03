import React, { useEffect } from "react";
import styles from "./Toast.module.css";
import type { INotification } from "../../store/storeNotifications";

interface ToastProps extends INotification {
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, emoji, duration, onClose }) => {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getTypeClass = () => {
    switch (type) {
      case "success":
        return styles.success;
      case "error":
        return styles.error;
      case "info":
        return styles.info;
      case "warning":
        return styles.warning;
      default:
        return "";
    }
  };

  return (
    <div className={`${styles.toast} ${getTypeClass()}`}>
      <div className={styles.toastContent}>
        {emoji && <span className={styles.emoji}>{emoji}</span>}
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeButton} onClick={() => onClose(id)}>
        ✕
      </button>
    </div>
  );
};

export default Toast;
