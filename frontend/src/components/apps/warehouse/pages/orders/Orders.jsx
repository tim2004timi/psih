import React, {useState, useRef, useEffect} from 'react';
import './Orders.css';
import PopularButton from '../../../../popularButton/PopularButton';
import search from '../../../../../assets/img/search_btn.svg'
import HeaderButton from '../../../../headerApp/headerButton/HeaderButton';
import settings from '../../../../../assets/img/table__settings.png'
import plus from '../../../../../assets/img/plus_zakaz.svg'
import close from '../../../../../assets/img/close_filter.png'
import szhatie from '../../../../../assets/img/szhatie-strok.png'
import editor from '../../../../../assets/img/editor-btn.png'
import deleteTable from '../../../../../assets/img/delete-table.png'
import { Link } from 'react-router-dom';
import OrderTable from '../../OrderTable/OrderTable';

const Orders = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const [selectedColumns, setSelectedColumns] = useState(['№', 'дата', 'покупатель', 'статус', 'сообщения', 'тег', 'сумма']);
    const [showColumnList, setShowColumnList] = useState(false);
    const columnsListRef =  useRef(null);
    const columnsListBtnRef = useRef(null);

    const [idList, setIdList] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showIdList, setShowIdList] = useState(false);

    const [statusList, setStatusList] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [showStatusList, setShowStatusList] = useState(false);

    const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
    const [filterIdArrowActive, setFilterIdArrowActive] = useState(false);
    const [filterStatusArrowActive, setFilterStatusArrowActive] = useState(false);

    const columns = ['№', 'дата', 'покупатель', 'статус', 'сообщения', 'тег', 'сумма', 'канал продаж', 'адрес доставки', 'доставка', 'заметки', 'комментарий', 'телефон', 'почта'];

    const handleCheckboxCount = (value) => {
        setActiveCheckboxCount(value);
    };

    const handleIdList = (ids) => {
        setIdList(ids);
    }

    const handleStatusList = (status) => {
        setStatusList(status);
    }

    // useEffect(() => {
    //     console.log(statusList)
    // }, [statusList]);

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

        if (columnsListBtnRef.current && columnsListBtnRef.current.contains(event.target)) {
            return;
        }

        if (columnsListRef.current && !columnsListRef.current.contains(event.target) && event.target !== columnsListRef.current) {
            setShowColumnList(false);
        }

    };

    useEffect(() => {

        if (isFilterOpen || showColumnList) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };

    }, [isFilterOpen, showColumnList]);

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

    const handleIdSelection = (id) => {
        setSelectedIds(prevIds => {
            if (prevIds.includes(id)) {
                return prevIds.filter(selectedId => selectedId !== id);
            } else {
                return [...prevIds, id];
            }
        });
    };

    const handleStatusSelection = (status) => {
        setSelectedStatus(prevStatus => {
            if (prevStatus.includes(status)) {
                return prevStatus.filter(selectedStatus => selectedStatus !== status);
            } else {
                return [...prevStatus, status];
            }
        });
    };

    useEffect(() => {
        const selectedItems = document.querySelectorAll('.id-list__item-selected');
        selectedItems.forEach(item => item.classList.remove('id-list__item-selected-last'));
        if (selectedItems.length > 0) {
            selectedItems[selectedItems.length - 1].classList.add('id-list__item-selected-last');
        }
    }, [selectedIds]);

    return (
    <div>
        <div className="orders__header">
                <div className="orders__btn-container">
                    <PopularButton text={'Фильтр'} isHover={true} onClick={openFilter} />
                    <Link to="/neworder">
                        <PopularButton img={plus} text={'Заказ'} isHover={true}/>
                    </Link>
                </div>  
                <div className="orderTable-btn__container">
                    <div className="orderTable-btn__counter">{activeCheckboxCount}</div>
                    <button className='orderTable-btn orderTable-btn__szhatie'>
                        <img className='orderTable-btn__img' src={szhatie} alt="szhatie" />
                    </button>
                    <button className='orderTable-btn orderTable-btn__editor'>
                        <img className='orderTable-btn__img' src={editor} alt="editor" />
                    </button>
                    <button className='orderTable-btn orderTable-btn__deleteTable'>
                        <img className='orderTable-btn__img' src={deleteTable} alt="deleteTable" />
                    </button>
                </div>
                <button className='orderTable__settings-btn' ref={columnsListBtnRef} onClick={() => {setShowColumnList(!showColumnList)}}>
                    <img src={settings} alt="settings" />
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
        {isFilterOpen &&  
            <div className="filter" ref={filterRef}>
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
                            <div className="filter__content-container" onClick={() => {
                                    setShowIdList(!showIdList);
                                    setFilterIdArrowActive(!filterIdArrowActive);
                                }}>
                                <div className="filter__content-selectedId">
                                    {selectedIds.length > 0 ? selectedIds.join(', ') : ''}
                                </div>
                                <button className='filter__content-btn'>
                                    <span className={`filter__arrow ${filterIdArrowActive ? 'filter__arrow-active' : ''}`}>
                                        <span className='filter__arrow-btn'></span>
                                        <span className='filter__arrow-btn'></span>
                                    </span>
                                </button>
                            </div>
                            {showIdList && <div className="id-list">
                                <div className="id-list__content">
                                        {[...selectedIds, ...idList.filter(id => !selectedIds.includes(id))].map(id => (
                                            <button 
                                                key={id} 
                                                className={`id-list__item ${selectedIds.includes(id) ? 'id-list__item-selected' : ''}`} 
                                                onClick={() => handleIdSelection(id)}
                                            >
                                                {id}
                                            </button>
                                        ))}
                                </div>
                            </div>}
                        </div>
                        <div className="filter__item">
                            <p className="filter__text">Статус</p>
                            <div className="filter__content-container" onClick={() => {
                                    setShowStatusList(!showStatusList);
                                    setFilterStatusArrowActive(!filterStatusArrowActive);
                                }}>
                                <div className="filter__content-selectedStatus">
                                    {selectedStatus.length > 0 ? selectedStatus.join(', ') : ''}
                                </div>
                                <button className='filter__content-btn'>
                                    <span className={`filter__arrow ${filterStatusArrowActive ? 'filter__arrow-active' : ''}`}>
                                        <span className='filter__arrow-btn'></span>
                                        <span className='filter__arrow-btn'></span>
                                    </span>
                                </button>
                            </div>
                            {showStatusList && <div className="status-list">
                                <div className="status-list__content">
                                        {[...selectedStatus, ...statusList.filter(status => !selectedStatus.includes(status))].map(status => (
                                            <button 
                                                className={`status-list__item ${selectedStatus.includes(status) ? 'status-list__item-selected' : ''}`} 
                                                onClick={() => handleStatusSelection(status)}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="filter-btn-container">
                        <PopularButton text={'Очистить всё'} isHover={true}/>
                        <PopularButton text={'Применить'} isHover={true}/>
                    </div>
                </div>
            </div>
        }
        <div className="separator"></div>
        <OrderTable selectedColumns={selectedColumns} childValue={[handleCheckboxCount, handleIdList, handleStatusList]}/>
    </div>
    )
}

export default Orders