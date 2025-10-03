import React from "react";
import styles from "./ToastContainer.module.css";
import Toast from "../Toast/Toast";
import useNotificationStore from "../../store/storeNotifications";

const ToastContainer: React.FC = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          {...notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
