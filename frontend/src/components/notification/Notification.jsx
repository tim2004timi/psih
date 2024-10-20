import React, { useState, useEffect } from 'react';
import close from '../../assets/img/close_filter.png';
import './Notification.css'

const Notification = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, [message]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className={`notification ${isVisible ? "" : "hidden"}`}>
      {/* <div className="notification__btn">
        <button className="notification__btn-button" onClick={handleClose}>
          <img src={close} alt="close" className="notification__btn-img" />
        </button>
      </div> */}
      <p className="notification__text">{message}</p>
    </div>
  );
};

export default Notification;