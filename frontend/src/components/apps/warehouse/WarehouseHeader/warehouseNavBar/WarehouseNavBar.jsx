import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './WarehouseNavBar.css';
const WarehouseNavBar = () => {
  const location = useLocation();

  return ( 
      <ul className="WarehouseNavBar__container">
        <li className={ 
        `WarehouseNavBar__container-li 
        ${
          location.pathname === '/orders' 
          || location.pathname === '/orders/neworder/orderdata' 
          || location.pathname === '/orders/:id/orderdata' 
          ? 
          'WarehouseNavBar__container-li_active' 
          : 
          ''
        }`}>
          <Link className='WarehouseNavBar__container-link' to="/orders">Заказы</Link>
        </li>
        <li className={
          `WarehouseNavBar__container-li 
          ${
            location.pathname === '/products' 
            || location.pathname === '/productsarchive' 
            ? 
            'WarehouseNavBar__container-li_active' 
            : 
            ''
          }`}>
          <Link className='WarehouseNavBar__container-link' to="/products">Товары</Link>
        </li>
        <li className={
          `WarehouseNavBar__container-li 
          ${
            location.pathname === '/remains' 
            ? 
            'WarehouseNavBar__container-li_active' 
            : 
            ''
          }`}>
          <Link className='WarehouseNavBar__container-link' to="/remains">Остатки</Link>
        </li>
        <li className={
          `WarehouseNavBar__container-li 
          ${location.pathname === '/parties' 
          ? 
          'WarehouseNavBar__container-li_active' 
          : 
          ''}`}>
          <Link className='WarehouseNavBar__container-link' to="/parties">Партии</Link>
        </li>
      </ul>
    );
}
 
export default WarehouseNavBar;