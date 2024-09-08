import React from 'react';
import { Link } from 'react-router-dom';
import back from '../../../../../assets/img/back_warehouse_btn.svg';
import PopularButton from '../../../../popularButton/PopularButton';
import './Newproducts.css';

const Newproducts = () => {
    return ( 
        <div>
            <div className="Newproducts__header">
                <div className="back-btn">
                    <Link to={'/products'}>
                        <PopularButton img={back} />
                    </Link>
                </div>
                <div className="Newproducts__select-container">
                    <div>заказ 187</div>
                </div>
                <div className="delete-btn">
                    <PopularButton text={'Удалить'} />
                </div>
            </div>
            <div className="Newproducts__separator"></div>
        </div>
    );
}
 
export default Newproducts;