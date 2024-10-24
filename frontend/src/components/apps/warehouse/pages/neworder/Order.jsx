import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate, Outlet } from 'react-router-dom';
import back from '../../../../../assets/img/back_warehouse_btn.svg';
import PopularButton from '../../../../popularButton/PopularButton';
import './Order.css';
import { useSelector } from 'react-redux';
import axios from "axios";
import { deleteOrder } from '../../../../../API/ordersAPI'; 
import DropDownList from '../../../../dropDownList/DropDownList';
import NotificationManager from "../../../../notificationManager/NotificationManager";
import NotificationStore from "../../../../../NotificationStore";
import { observer } from 'mobx-react-lite';

const Order = observer(() => {
    const { id } = useParams();
    const ids = useSelector(state => state.ids);
    // const [formData, setFormData] = useState({
    //     full_name: '',
    //     status: '',
    //     tag: '',
    //     channel: '',
    //     address: '',
    //     task: '',
    //     note: '',
    //     comment: '',
    //     storage: '',
    //     project: '',
    //     phone_number: '',
    //     email: ''
    // });

    const [ordersDate, setOrdersDate] = useState('')
    const filteredIds = ids.filter(item => item !== id);
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const deleteOverlayRef = useRef(null);
    const navigate = useNavigate();

    const { errorText, successText, setErrorText, setSuccessText, resetErrorText, resetSuccessText } = NotificationStore;

    // useEffect(() => {
    //     console.log(ordersDate)
    // }, [ordersDate]);

    async function deleteOrderData(id) {
        try {
            const response = await deleteOrder(id);
            navigate('/orders');
            // console.log(response.data);
            setSuccessText('Вы успешно удалили заказ!')
        } catch (error) {
            console.error(error);
            setErrorText(error.response.data.detail)
        }
    }

    const openDeleteOverlay = () => {
        deleteOverlayRef.current.style.display = 'flex';
    }

    const closeDeleteOverlay = () => {
        deleteOverlayRef.current.style.display = 'none';
    }

    // const handleSelectOrderSelection = (selected) => {
    //     setSelectedOrder(selected);
    // };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value
    //     });
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch('http://87.242.85.68:8000/orders/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(formData)
    //         });
    //         const result = await response.json();
    //         console.log('Success:', result);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    return ( 
        <div>
            <div className="Neworder__header">
                <div className="back-btn">
                    <Link to={'/orders'}>
                        {/* <PopularButton img={back} /> */}
                        <button className="back-btn__btn">
                            <div className="back-btn__arrow"></div>
                        </button>
                    </Link>
                </div>
                <div className="Neworder__header-info">
                    <div className="selectOrder">
                        <DropDownList
                            selectedItemText='заказ - '
                            items={filteredIds}
                            isItemLink={true}
                            startItem={id}
                            statusList={false}
                            currentPage='orders'
                        />
                    </div>
                    <p className="Neworder__header-date">
                        {ordersDate}
                    </p>
                </div>
                <div className="delete-btn">
                    <button className="delete-btn__btn" onClick={() => openDeleteOverlay()}>Удалить</button>
                </div>
            </div>
            <div className="deleteOverlay" ref={deleteOverlayRef}>
                <div className="deleteContent">
                    <h2 className="deleteContent__title">Удалить заказ ?</h2>
                    <div className="deleteContent__btn-container">
                        <button className='deleteContent__btn-cancel' onClick={() => closeDeleteOverlay()}>Отмена</button>
                        <button className='deleteContent__btn-delete' onClick={() => deleteOrderData(id)}>Удалить</button>
                    </div>
                </div>
            </div>
            <div className="Neworder__separator"></div>
            {errorText && <NotificationManager errorMessage={errorText} resetFunc={resetErrorText}/>}
            {successText && <NotificationManager successMessage={successText} resetFunc={resetSuccessText} />}
            <Outlet context={{ ordersDate, setOrdersDate }}/>
        </div>
    );
});
 
export default Order;