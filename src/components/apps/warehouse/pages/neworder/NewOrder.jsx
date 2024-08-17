import React from 'react';
import { Link } from 'react-router-dom';
import back from '../../../../../assets/img/back_warehouse_btn.svg';
import PopularButton from '../../../../popularButton/PopularButton';
import './NewOrder.css';

const NewOrder = () => {
    return ( 
        <div>
            <div className="Neworder__header">
                <div className="back-btn">
                    <Link to={'/orders'}>
                        <PopularButton img={back} />
                    </Link>
                </div>
                <div className="Neworder__select-container">
                    <div>заказ 187</div>
                </div>
                <div className="delete-btn">
                    <PopularButton text={'Удалить'} />
                </div>
            </div>
            <div className="Neworder__separator"></div>
            <div className="Neworder__info">
                <div className="Neworder__info-container">
                    <div className="Neworder__info-item">Д.Д.Аекс</div>
                    <div className="Neworder__info-item">Статус заказа</div>
                    <div className="Neworder__info-item">29.07.2024 | 12:30</div>
                </div>
                <div className="Neworder__info-btn">
                    <PopularButton text={'Редактировать'} />
                </div>
            </div>
        </div> 
    );
}
 
export default NewOrder;