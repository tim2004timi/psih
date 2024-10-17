import React from 'react';
import AppNavBar from './appNavBar/AppNavBar';
import logo from '../../assets/img/logo.svg';
import HeaderButton from './headerButton/HeaderButton';
import search from '../../assets/img/search_btn.svg';
import notification from '../../assets/img/notifications_btn.svg';
import account from '../../assets/img/acount_btn.svg';
import './HeaderApp.css';
import { Link } from 'react-router-dom';

const HeaderApp = () => {
    return ( 
        <div className="header">
            <div className='header-top__container'>
                <div className='logo'>
                    <a className='logo_link'>
                        <img className='logo_img' src={logo} alt="logo" />
                    </a>
                </div>
                <AppNavBar />
                <div className="header-top__btn-container">
                    <HeaderButton img={notification} />
                    <HeaderButton 
                        img={account} 
                        as={Link} 
                        to="/profile" 
                    />
                </div>
            </div>
            <div className="separator"></div>
        </div>
     );
}
 
export default HeaderApp;