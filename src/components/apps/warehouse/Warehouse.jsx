import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderApp from '../../headerApp/HeaderApp';
import WarehouseHeader from './WarehouseHeader/WarehouseHeader';

const Warehouse = () => {
    return (
    <div>
        <HeaderApp />
        <WarehouseHeader />
        <Outlet />
    </div>
    )
}

export default Warehouse