import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './appNavBar.css';

const AppNavBar = () => {
    const location = useLocation();

    return ( 
        <ul className="Appnavbar__container">
            <li className={
            `Appnavbar__container-li ${
            location.pathname === '/' 
            || location.pathname === '/orders' 
            || location.pathname === '/orders/neworder/orderdata' 
            || location.pathname === '/products' 
            || location.pathname === '/productsarchive' 
            || location.pathname === '/remains' 
            || location.pathname === '/parties' 
            || location.pathname === '/neworder'
            ?
            'Appnavbar__container-li_active' 
            : 
            ''}`}>
                <Link className="Appnavbar__container-link" to="/">Склад</Link>
            </li>
            <li className={`Appnavbar__container-li ${location.pathname === '/messager'  ? 'Appnavbar__container-li_active' : ''}`}>
                <Link className="Appnavbar__container-link" to="/messager">Сообщения</Link>
            </li>
            <li className={`Appnavbar__container-li ${location.pathname === '/crm' ? 'Appnavbar__container-li_active' : ''}`}>
                <Link className="Appnavbar__container-link" to="/crm">CRM</Link>
            </li>
            <li className={`Appnavbar__container-li`}>
                <Link className="Appnavbar__container-link" to="">Пользователи</Link>
            </li>
            <li className={`Appnavbar__container-li`}>
                <Link className="Appnavbar__container-link" to="">Задачи</Link>
            </li>
            <li className={`Appnavbar__container-li`}>
                <Link className="Appnavbar__container-link" to="">Аналитика</Link>
            </li>
        </ul>
     );
}
 
export default AppNavBar;