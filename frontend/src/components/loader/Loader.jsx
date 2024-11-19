import React from 'react';
import './Loader.css';
import logo from '../../assets/img/logo.svg'

const Loader = () => {
    return (
      <div className="loader-container">
        <div className="loader">
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
          <a className="loader__logo">
            <img src={logo} alt="logo" className="loader__logo-img" />
          </a>
        </div>
      </div>
    );
}
 
export default Loader;