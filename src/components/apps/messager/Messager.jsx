import React from 'react';
import HeaderApp from '../../headerApp/HeaderApp';

const Messager = () => {
    return (
        <div> 
            <HeaderApp isWarehouse={false} isMessager={true} isCrm={false} isUsers={false} />
        </div>
    )
}

export default Messager