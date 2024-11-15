import React from 'react';
import './Loader.css';
import logo from '../../assets/img/logo.svg'

const Loader = () => {
    return (
      <div class="loader-container">
        <div class="loader">
          <div class="loader-bar"></div>
          <div class="loader-bar"></div>
          <a className="loader__logo">
            <img src={logo} alt="logo" className="loader__logo-img" />
          </a>
        </div>
      </div>
    );
}
 
export default Loader;