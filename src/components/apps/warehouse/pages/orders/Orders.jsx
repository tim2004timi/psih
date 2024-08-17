import React, {useState, useRef, useEffect} from 'react';
import './Orders.css';
import PopularButton from '../../../../popularButton/PopularButton';
import search from '../../../../../assets/img/search_btn.svg'
import HeaderButton from '../../../../headerApp/headerButton/HeaderButton';
import settings from '../../../../../assets/img/table__settings.png'
import plus from '../../../../../assets/img/plus_zakaz.svg'
import close from '../../../../../assets/img/close_filter.png'
import { Link } from 'react-router-dom';
import OrderTable from '../../OrderTable/OrderTable';

const Orders = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const [selectedColumns, setSelectedColumns] = useState(['№', 'дата', 'покупатель', 'статус', 'сообщения', 'тег', 'сумма']);
    const [showColumnList, setShowColumnList] = useState(false);

    const columns = ['№', 'дата', 'покупатель', 'статус', 'сообщения', 'тег', 'сумма', 'канал продаж', 'адрес доставки', 'доставка', 'заметки', 'комментарий', 'телефон', 'почта'];

    const openFilter = () => {
        setIsFilterOpen(true);
    };

    const closeFilter = () => {
        setIsFilterOpen(false);
    };

    const handleOutsideClick = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            closeFilter();
        }
    };

    useEffect(() => {
        if (isFilterOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isFilterOpen]);

    const handleColumnSelect = (column) => {
        if (selectedColumns.includes(column)) {
            setSelectedColumns(selectedColumns.filter(col => col !== column));
        } else {
            let inserted = false;
            const newSelectedColumns = selectedColumns.reduce((acc, selectedColumn) => {

                if (columns.indexOf(column) < columns.indexOf(selectedColumn) && !inserted) {
                    acc.push(column);
                    inserted = true;
                }
                
                acc.push(selectedColumn);
                return acc;
            }, []);
    
            if (!inserted) {
                newSelectedColumns.push(column);
            }
    
            setSelectedColumns(newSelectedColumns);
        }
    };

    return (
    <div>
        <div className="orders__header">
                <div className="orders__btn-container">
                    <PopularButton text={'Фильтр'} isHover={true} onClick={openFilter} />
                    <Link to="/neworder">
                        <PopularButton img={plus} text={'Заказ'} isHover={true}/>
                    </Link>
                </div>    
                <HeaderButton img={settings} onClick={() => setShowColumnList(!showColumnList)}/>
                {showColumnList && (
                    <div className='orderTable__settings'>
                        {columns.map((column, index) => (
                            <div key={index} className='orderTable__settings-container'>
                                <label className='orderTable__settings-item'>
                                    <div className="orderTable__settings-content">
                                        {column}
                                    </div>
                                    <div className="orderTable__settings-input">
                                        <input
                                            type="checkbox"
                                            className="custom-checkbox"
                                            checked={selectedColumns.includes(column)}
                                            onChange={() => handleColumnSelect(column)}
                                        />
                                        <span className="checkbox-custom"></span>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
        </div>
        <div className="separator"></div>
        {isFilterOpen &&  
            <form className="filter" ref={filterRef}>
                <div className="filter__content">
                    <div className="closeBtn__container">
                        <HeaderButton onClick={closeFilter} img={close}/>
                    </div>
                    <div className="filter__container">
                        <div className="filter__item">
                            <p className="filter__text">Дата</p>
                            <input className='filter__input' type="date" />
                        </div>
                        <div className="filter__item">
                            <p className="filter__text">Покупатель</p>
                            <input className='filter__input filter__input--pokupatel' type="text" />
                        </div>
                    </div>
                    <div className="filter__container">
                        <div className="filter__item">
                            <p className="filter__text">Номер заказа</p>
                            <input className='filter__input filter__input--zakaz' type="number" />
                        </div>
                        <div className="filter__item">
                            <p className="filter__text">Статус</p>
                            <select className="filter__select" >
                                <option value="option1" disabled hidden></option>
                                <option value="option2">в обработке</option>
                                <option value="option3">возврат</option>
                                <option value="option4">доставлен</option>
                                <option value="option5">бартер</option>
                            </select>
                        </div>
                    </div>
                    <div className="filter-btn-container">
                        <PopularButton text={'Очистить всё'} isHover={true}/>
                        <PopularButton text={'Применить'} isHover={true}/>
                    </div>
                </div>
            </form>
        }
        <div className="separator"></div>
        <OrderTable selectedColumns={selectedColumns}/>
    </div>
    )
}

export default Orders