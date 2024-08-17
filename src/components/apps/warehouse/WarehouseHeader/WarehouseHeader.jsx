import React from 'react';
import WarehouseNavBar from './warehouseNavBar/WarehouseNavBar';
import './WareHouseHeader.css';

const WarehouseHeader = () => {
    return ( 
        <div className="WarehouseHeader__container">
            <WarehouseNavBar />
            <div className="separator"></div>
        </div> 
     );
}
 
export default WarehouseHeader;