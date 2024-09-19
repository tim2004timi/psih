import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderApp from '../../headerApp/HeaderApp';
import WarehouseHeader from './WarehouseHeader/WarehouseHeader';

const Warehouse = () => {
    return (
    <div>
        <HeaderApp />
        <div className="separator"></div>
        <WarehouseHeader />
        <div className="separator"></div>
        <Outlet />
    </div>
    )
}

export default Warehouse