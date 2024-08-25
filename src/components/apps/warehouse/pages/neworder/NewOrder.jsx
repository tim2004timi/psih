import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import back from '../../../../../assets/img/back_warehouse_btn.svg';
import PopularButton from '../../../../popularButton/PopularButton';
import './NewOrder.css';

const NewOrder = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        status: '',
        tag: '',
        channel: '',
        address: '',
        task: '',
        note: '',
        comment: '',
        storage: '',
        project: '',
        phone_number: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://87.242.85.68:8000/orders/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    };
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
            <form onSubmit={handleSubmit}>
                <label>
                    Имя покупателя:
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Статус:
                    <input type="text" name="status" value={formData.status} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Тег:
                    <input type="text" name="tag" value={formData.tag} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Канал продаж:
                    <input type="text" name="channel" value={formData.channel} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Адрес:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Задача:
                    <input type="text" name="task" value={formData.task} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Заметка:
                    <input type="text" name="note" value={formData.note} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Комментарий:
                    <input type="text" name="comment" value={formData.comment} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Склад:
                    <input type="text" name="storage" value={formData.storage} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Проект:
                    <input type="text" name="project" value={formData.project} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Номер телефона:
                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                </label>
                <br /><br />

                <label>
                    Почта:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <br /><br />

                <button type="submit">Создать</button>
            </form>
        </div> 
    );
}
 
export default NewOrder;