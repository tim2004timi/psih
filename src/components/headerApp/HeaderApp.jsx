import React from 'react';
import AppNavBar from './appNavBar/AppNavBar';
import logo from '../../assets/img/logo.svg';
import HeaderButton from './headerButton/HeaderButton';
import search from '../../assets/img/search_btn.svg';
import notification from '../../assets/img/notifications_btn.svg';
import acount from '../../assets/img/acount_btn.svg';
import './HeaderApp.css';

const HeaderApp = () => {
    return ( 
        <div className="header">
            <div className='header-top__container'>
                <AppNavBar />
                <div className='logo'>
                    <a className='logo_link'>
                        <img className='logo_img' src={logo} alt="logo" />
                    </a>
                </div>
                <div className="header-top__btn-container">
                    <HeaderButton img={search} />
                    <HeaderButton img={notification} />
                    <HeaderButton img={acount} />
                </div>
            </div>
            <div className="separator"></div>
        </div>
     );
}
 
export default HeaderApp;