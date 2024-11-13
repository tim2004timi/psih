import React from 'react';
import './Loader.css';
import logo from '../../assets/img/logo.svg'

const Loader = () => {
    return (
      <div class="loader-container">
        <div class="loader">
          <div className="bar bar1"></div>
          <div className="bar bar2"></div>
        </div>
        <a className="logo">
          <img src={logo} alt="logo" className="logo__img" />
        </a>
      </div>
    );
}
 
export default Loader;