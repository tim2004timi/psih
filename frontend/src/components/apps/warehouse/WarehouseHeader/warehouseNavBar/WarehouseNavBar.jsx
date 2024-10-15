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
          location.pathname === '/warehouse/orders' 
          || location.pathname === '/warehouse/orders/neworder/orderdata' 
          || location.pathname === '/warehouse/orders/:id/orderdata' 
          ? 
          'WarehouseNavBar__container-li_active' 
          : 
          ''
        }`}>
          <Link className='WarehouseNavBar__container-link' to="/warehouse/orders">Заказы</Link>
        </li>
        <li className={
          `WarehouseNavBar__container-li 
          ${
            location.pathname === '/warehouse/products' 
            || location.pathname === '/warehouse/productsarchive' 
            ? 
            'WarehouseNavBar__container-li_active' 
            : 
            ''
          }`}>
          <Link className='WarehouseNavBar__container-link' to="/warehouse/products">Товары</Link>
        </li>
        <li className={
          `WarehouseNavBar__container-li 
          ${
            location.pathname === '/warehouse/remains' 
            ? 
            'WarehouseNavBar__container-li_active' 
            : 
            ''
          }`}>
          <Link className='WarehouseNavBar__container-link' to="/warehouse/remains">Остатки</Link>
        </li>
        <li className={
          `WarehouseNavBar__container-li 
          ${location.pathname === '/warehouse/parties' 
          ? 
          'WarehouseNavBar__container-li_active' 
          : 
          ''}`}>
          <Link className='WarehouseNavBar__container-link' to="/warehouse/parties">Партии</Link>
        </li>
      </ul>
    );
}
 
export default WarehouseNavBar;