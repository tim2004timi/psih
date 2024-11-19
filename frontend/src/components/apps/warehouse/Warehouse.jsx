import React, {Suspense} from 'react';
import { Outlet } from 'react-router-dom';
import HeaderApp from '../../headerApp/HeaderApp';
import WarehouseHeader from './WarehouseHeader/WarehouseHeader';
import Loader from '../../loader/Loader';

const Warehouse = () => {
    return (
    <div>
        <HeaderApp />
        <div className="separator"></div>
        <WarehouseHeader />
        <div className="separator"></div>
        <Suspense fallback={<Loader />}>
            <Outlet />
        </Suspense>
    </div>
    )
}

export default Warehouse