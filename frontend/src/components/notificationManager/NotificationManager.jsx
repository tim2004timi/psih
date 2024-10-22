import React, { useEffect, useState } from 'react'; 
import Notification from '../notification/Notification'; 
import './NotificationManager.css'; 

const NotificationManager = ({ errorMessage, successMessage, resetFunc }) => { 
  const [notifications, setNotifications] = useState([]); 

  // useEffect(() => {

  //   console.log(resetFunc)
  // }, [resetFunc])

  useEffect(() => { 
    if (errorMessage) { 
      console.log(errorMessage);
      const newNotification = { id: Date.now(), config: 'error', message: errorMessage }; 
      setNotifications(prevNotifications => [...prevNotifications, newNotification]); 
      // resetFunc()
    }  

    if (successMessage) { 
      console.log(successMessage);
      const newNotification = { id: Date.now(), config: 'success', message: successMessage }; 
      setNotifications(prevNotifications => [...prevNotifications, newNotification]); 
      // resetFunc()
    }  
  }, [errorMessage, successMessage]); 

  const handleRemoveNotification = (id) => { 
    setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id)); 
  }; 

  return ( 
    <div className="notification-container"> 
      {notifications.map(notification => ( 
        <Notification 
          key={notification.id} 
          message={notification.message} 
          config={notification.config} 
          onClose={() => handleRemoveNotification(notification.id)} 
        /> 
      ))} 
    </div> 
  ); 
}; 

export default NotificationManager;
