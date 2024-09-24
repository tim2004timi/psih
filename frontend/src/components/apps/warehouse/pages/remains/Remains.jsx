import React, {useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import PopularButton from '../../../../popularButton/PopularButton';
import szhatie from '../../../../../assets/img/szhatie-strok.png';
import editor from '../../../../../assets/img/editor-btn.png';
import deleteTable from '../../../../../assets/img/delete-table.png';
import settings from '../../../../../assets/img/table-settings.svg';


const Remains = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const filterBtnRef = useRef(null);

    const orderTableBtnContainerRef = useRef(null);

    const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
    const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);
    const [selectedFilterItems, setSelectedFilterItems] = useState({});

    const columns = ['№', 'дата', 'покупатель', 'статус', 'сообщения', 'тег', 'сумма', 'канал продаж', 'адрес доставки', 'доставка', 'заметки', 'комментарий', 'телефон', 'почта'];

    const [selectedColumns, setSelectedColumns] = useState(['№', 'дата', 'покупатель', 'статус', 'сообщения', 'тег', 'сумма']);
    const [showColumnList, setShowColumnList] = useState(false);
    const columnsListRef = useRef(null);
    const columnsListBtnRef = useRef(null);

    const showFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };
     
    return (
        <>
            <div className="remains__header">
                <div className="remains__header-container">
                    <div className="orders__btn-container">
                        {/* <PopularButton text={'Фильтр'} isHover={true} onClick={openFilter} /> */}
                        <button className='orders__btn-filter' onClick={showFilter} ref={filterBtnRef}>Фильтр</button>
                        <Link to="/orders/neworder">
                            <PopularButton text={'+ Заказ'} isHover={true}/>
                        </Link>
                    </div>  
                    <div className="orderTable-btn__container" ref={orderTableBtnContainerRef}>
                        <div className="orderTable-btn__counter">{activeCheckboxCount}</div>
                        <button className='orderTable-btn orderTable-btn__szhatie'>
                            <img className='orderTable-btn__img' src={szhatie} alt="szhatie" />
                        </button>
                        <button className='orderTable-btn orderTable-btn__editor'>
                            <img className='orderTable-btn__img' src={editor} alt="editor" />
                        </button>
                        <button className='orderTable-btn orderTable-btn__deleteTable' onClick={() => {
                            deleteSelectedOrders(activeCheckboxIds)
                            setIsFetchData(true)
                        }}>
                            <img className='orderTable-btn__img' src={deleteTable} alt="deleteTable"/>
                        </button>
                    </div>
                    <button className='orderTable__settings-btn' ref={columnsListBtnRef} onClick={() => {setShowColumnList(!showColumnList)}}>
                        <img className='orderTable__settings-img' src={settings} alt="settings" />
                        {/* <img className='orderTable__settings-img--hover' src={settingsHover} alt="settings" /> */}
                    </button>
                    {showColumnList && (
                        <div className='orderTable__settings' ref={columnsListRef}>
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
            </div>
        </>
    )
}

export default Remains
