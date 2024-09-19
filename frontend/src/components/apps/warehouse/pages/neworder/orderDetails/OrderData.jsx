import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './OrderData.css';
import DropDownList from '../../../../../dropDownList/DropDownList';
import { createOrder, getOrderById, patchOrder } from '../../../../../../API/ordersAPI';
import settings from '../../../../../../assets/img/table-settings.svg';
import InputMask from 'react-input-mask';

const OrderData = () => {
    const { id } = useParams();
    const [orderInfo, setOrderInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([[], []]);
    const [editableFields, setEditableFields] = useState({});
    const [statusObj, setStatusObj] = useState({});
    const [tagObj, setTagObj] = useState({});
    const [localPhone, setLocalPhone] = useState('')
    const navigate = useNavigate();
    const phoneInputRef = useRef(null);

    const getOrderData = async (id) => {
        try {
            const response = await getOrderById(id);
            setOrderInfo(response.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(true);
        }
    };

    useEffect(() => {
        if (id !== undefined) {
            getOrderData(id);
        } else {
            setIsLoading(false);
        }
    }, [id]);

    const handleChange = (e, field) => {
        const value = e.target.value;
        setOrderInfo((prev) => ({ ...prev, [field]: value }));

        if (id === undefined) {
            setEditableFields((prev) => ({ ...prev, [field]: value }));
            return;
        }

        updateOrderInfo(field, value);
    };

    const handleFileChange = (e, index) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles[index] = Array.from(e.target.files);
        setSelectedFiles(newSelectedFiles);
    };

    const updateOrderInfo = async (key, value) => {
        try {
            await patchOrder(id, key, value);
        } catch (error) {
            console.error(error);
        }
    };

    const createOrderData = async () => {
        const finalFields = { ...editableFields, ...statusObj, ...tagObj };
        try {
            const response = await createOrder(finalFields);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusObj = (obj) => {
        setStatusObj(obj);
    };

    const handleTagObj = (obj) => {
        setTagObj(obj);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="orderData__header">
                <div className="orderData__navBar">
                    <Link className='orderData__navBar-link' to={`/orders/${id}/orderdata`}>Данные заказа</Link>
                    <Link className='orderData__navBar-link'>Доставка</Link>
                    <Link className='orderData__navBar-link'>Выставить счет для оплаты</Link>
                </div>
                <div className="orderData__header-data">
                    <DropDownList
                        statusList={true}
                        startItem={id ? orderInfo.status : 'статус заказа'}
                        rowId={orderInfo.id}
                        statusObj={id ? null : handleStatusObj}
                        currentPage='orders'
                    />
                    <DropDownList
                        statusList={false}
                        isItemLink={false}
                        startItem={id ? orderInfo.tag === null ? 'нет' : orderInfo.tag : 'тег'}
                        items={['бартер', 'нет']}
                        tagClass={true}
                        rowId={orderInfo.id}
                        tagObj={id ? null : handleTagObj}
                        currentPage='orders'                        
                    />
                </div>
                <div className='orderData__header-settings'>
                    <button className='OrderData__settings-btn'>
                        <img src={settings} alt="settings" />
                    </button>
                </div>
            </div>
            <div className="orderDataInfo">
                <div className="orderDataInfo__personalInfo">
                    <div className="orderDataInfo__header">
                        <div className="orderDataInfo__fullName orderDataInfo-item">
                            <input
                                className='orderDataInfo__input'
                                value={orderInfo.full_name || ''}
                                onChange={(e) => handleChange(e, 'full_name')}
                            />
                        </div>
                        <Link className="orderDataInfo__message orderDataInfo-item">Сообщения</Link>
                    </div>
                    <div className="orderDataInfo__email">
                        <p className="orderDataInfo__email-text orderDataInfo-text">Email</p>
                        <div className="orderDataInfo__email-content orderDataInfo-item">
                            <input
                                className='orderDataInfo__input'
                                value={orderInfo.email || ''}
                                onChange={(e) => handleChange(e, 'email')}
                            />
                        </div>
                    </div>
                    <div className="orderDataInfo__tel">
                        <p className="orderDataInfo__tel-text orderDataInfo-text">Телефон</p>
                        <div className="orderDataInfo__tel-content orderDataInfo-item">
                            <InputMask
                                mask="+7 (999) 999-99-99"
                                value={orderInfo.phone_number}
                                onChange={(e) => handleChange(e, 'phone_number')}
                                className='orderDataInfo__input'
                                ref={phoneInputRef}
                            />
                        </div>
                    </div>
                </div>
                <div className="orderDataInfo__geo">
                    <div className="orderDataInfo__geo-minicol">
                        <div className="orderDataInfo__channel">
                            <p className="orderDataInfo__channel-text orderDataInfo-text">Канал продаж</p>
                            <div className="orderDataInfo__channel-content orderDataInfo-item">
                                <input
                                    className='orderDataInfo__input'
                                    value={orderInfo.channel || ''}
                                    onChange={(e) => handleChange(e, 'channel')}
                                />
                            </div>
                        </div>
                        <div className="orderDataInfo__storage">
                            <p className="orderDataInfo__storage-text orderDataInfo-text">Склад</p>
                            <div className="orderDataInfo__storage-content orderDataInfo-item">
                                <input
                                    className='orderDataInfo__input'
                                    value={orderInfo.storage || ''}
                                    onChange={(e) => handleChange(e, 'storage')}
                                />
                            </div>
                        </div>
                        <div className="orderDataInfo__project">
                            <p className="orderDataInfo__project-text orderDataInfo-text">Проект</p>
                            <div className="orderDataInfo__project-content orderDataInfo-item">
                                <input
                                    className='orderDataInfo__input'
                                    value={orderInfo.project || ''}
                                    onChange={(e) => handleChange(e, 'project')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="orderDataInfo__geo-bigcol">
                        <div className="orderDataInfo__address">
                            <p className="orderDataInfo__address-text orderDataInfo-text">Адрес доставки</p>
                            <div className="orderDataInfo__address-content orderDataInfo-item">
                                <textarea
                                    className='orderDataInfo__input orderDataInfo__input-area'
                                    value={orderInfo.address || ''}
                                    onChange={(e) => handleChange(e, 'address')}
                                />
                            </div>
                        </div>
                        <div className="orderDataInfo__writing">
                            <div className="orderDataInfo__comment">
                                <p className="orderDataInfo__comment-text orderDataInfo-text">Комментарий</p>
                                <div className="orderDataInfo__comment-content orderDataInfo-item">
                                    <textarea
                                        className='orderDataInfo__input orderDataInfo__input-area'
                                        value={orderInfo.comment || ''}
                                        onChange={(e) => handleChange(e, 'comment')}
                                    />
                                </div>
                            </div>
                            <div className="orderDataInfo__note">
                                <p className="orderDataInfo__note-text orderDataInfo-text">Заметка</p>
                                <div className="orderDataInfo__note-content orderDataInfo-item">
                                    <textarea
                                        className='orderDataInfo__input orderDataInfo__input-area'
                                        value={orderInfo.note || ''}
                                        onChange={(e) => handleChange(e, 'note')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="orderDataInfo__files">
                    <p className="orderDataInfo__files-text orderDataInfo-text">Файлы</p>
                    {selectedFiles.map((files, index) => (
                        <div className="field__wrapper" key={index}>
                            <input
                                name="file"
                                type="file"
                                id={`field__file-${index + 2}`}
                                className="field field__file"
                                multiple
                                onChange={(e) => handleFileChange(e, index)}
                            />
                            <label className="field__file-wrapper" htmlFor={`field__file-${index + 2}`}>
                                <div className="field__file-fake">
                                    {files.length > 0 ? `Выбрано файлов: ${files.length}` : 'Файл не выбран'}
                                </div>
                                <div className="field__file-button">Выбрать</div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {
            id == undefined 
                ? 
                <button onClick={() => {
                    createOrderData();
                    navigate('/orders');
                }}>
                    Сохранить данные
                </button>
                : 
                null
            }
            <div className='orderData__tableSettins'>
                <button className='OrderData__tableSettins-btn'>
                    <img src={settings} alt="settings" />
                </button>
            </div>
            <table className="orderData__table">
                {/* <thead>
                    <tr>{renderHeaders()}</tr>
                </thead>
                <tbody>{renderRows()}</tbody> */}
            </table>
        </div>
    );
};

export default OrderData;