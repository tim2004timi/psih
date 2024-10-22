import React, { useState, useEffect } from 'react';
import './Notification.css'

const Notification = ({ message, onClose, config }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${config === 'error' ? "errorItem" : 'succeessItem'} ${isVisible ? '' : 'hidden'}`}>
      <p className='notification__text'>{message}</p>
      <button className={`notification__btn ${config === 'error' ? "errorItem" : 'succeessItem'}`} onClick={() => setIsVisible(false)}>{config === 'error' ? 'X' : 'V'}</button>
    </div>
  );
};

export default Notification;