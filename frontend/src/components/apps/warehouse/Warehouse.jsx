import React, {Suspense} from 'react';
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
        <Suspense fallback={<h1>Loading...</h1>}>
            <Outlet />
        </Suspense>
    </div>
    )
}

export default Warehouse