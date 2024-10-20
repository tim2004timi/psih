import React, { useEffect, useState } from 'react';
import Notification from '../notification/Notification';
import './NotificationManager.css'

const NotificationManager = ({ addNotification }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log(addNotification)
  }, [addNotification])

  const handleAddNotification = (message) => {
    const newNotification = { id: Date.now(), message };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  const handleRemoveNotification = (id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          onClose={() => handleRemoveNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;