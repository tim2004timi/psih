import React, { useState, useEffect } from 'react';

const Notification = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${isVisible ? '' : 'hidden'}`}>
      <p className='notification__text'>{message}</p>
      <button className='notification__btn' onClick={() => setIsVisible(false)}>Закрыть</button>
    </div>
  );
};

export default Notification;