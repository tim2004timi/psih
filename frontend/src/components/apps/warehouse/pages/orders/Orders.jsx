import React, { useState, useRef, useEffect } from 'react';
import './Orders.css';
import PopularButton from '../../../../popularButton/PopularButton';
import search from '../../../../../assets/img/search_btn.svg';
import HeaderButton from '../../../../headerApp/headerButton/HeaderButton';
import settings from '../../../../../assets/img/table-settings.svg';
import settingsHover from '../../../../../assets/img/settings-hover.png';
import plus from '../../../../../assets/img/plus_zakaz.svg';
import close from '../../../../../assets/img/close_filter.png';
import szhatie from '../../../../../assets/img/szhatie-strok.png';
import editor from '../../../../../assets/img/editor-btn.png';
import deleteTable from '../../../../../assets/img/delete-table.png';
import { Link } from 'react-router-dom';
import OrderTable from '../../OrderTable/OrderTable';
import FilterDropDownList from '../../../../filterDropDownList/FilterDropDownList';
import { deleteOrders } from '../../../../../API/ordersAPI';
import SearchableContent from '../../../../searchableContent/SearchableContent';

const Orders = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const filterBtnRef = useRef(null);

    const [selectedColumns, setSelectedColumns] = useState(['№', 'дата', 'покупатель', 'статус', 'сообщения', 'тег', 'сумма']);
    const [showColumnList, setShowColumnList] = useState(false);
    const columnsListRef = useRef(null);
    const columnsListBtnRef = useRef(null);

    const [isFetchData, setIsFetchData] = useState(false);

    const [idList, setIdList] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const [statusList, setStatusList] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState([]);

    const [tagList, setTagList] = useState(null);
    const [selectedTag, setSelectedTag] = useState([]);

    const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
    const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);
    const [selectedFilterItems, setSelectedFilterItems] = useState({});

    const [isClearFDDlistSelectedItems, setIsClearFDDlistSelectedItems] = useState(false);

    const inputPokupatelRef = useRef(null);

    const inputDateOrderRef = useRef(null);

    const orderTableBtnContainerRef = useRef(null);

    const columns = ['№', 'дата', 'покупатель', 'статус', 'сообщения', 'тег', 'сумма', 'канал продаж', 'адрес доставки', 'доставка', 'заметки', 'комментарий', 'телефон', 'почта'];

    const handleCheckboxCount = (checkboxCount, idsCount) => {
        setActiveCheckboxCount(checkboxCount);
        setActiveCheckboxIds(idsCount);
    };

    // useEffect(() => {
    //     console.log(inputDateOrderRef.current.value);
    // }, [inputDateOrderRef]);

    const handleIdList = (ids) => {
        setIdList(ids);
    }

    const handleStatusList = (status) => {
        setStatusList(status);
    }

    const handleTagList = (tag) => {
        setTagList(tag);
    }

    const handleFetchData = () => {
        setIsFetchData(false);
    }

    const showFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleFilterSelection = () => {
        setSelectedFilterItems({ id: selectedIds, order_date: inputDateOrderRef.current.value, status: selectedStatus, full_name: inputPokupatelRef.current.value, tag: selectedTag });
    }    

    const handleOutsideClick = (event) => {
        if (filterBtnRef.current && filterBtnRef.current.contains(event.target)) {
            return;
        }

        if (filterRef.current && !filterRef.current.contains(event.target) && event.target !== columnsListRef.current) {
            showFilter(false);
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

        if(isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isFilterOpen, showColumnList]);

    useEffect(() => {
        
        if (activeCheckboxCount > 0) {
            orderTableBtnContainerRef.current.style.display = 'flex';
        } else {
            orderTableBtnContainerRef.current.style.display = 'none';
        }

    }, [activeCheckboxCount])

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

    const handleSelectedIids = (items) => {
        setSelectedIds(items);
    };

    const handleSelectedStatus = (items) => {
        setSelectedStatus(items);
    };

    const handleSelectedTag = (items) => {
        setSelectedTag(items);
    };

    const clearSelectedItems = () => {
        setSelectedIds([]);
        setSelectedStatus([]);
        setSelectedTag([])
        setIsClearFDDlistSelectedItems(true);
    };

    const isClearDone = () => {
        setIsClearFDDlistSelectedItems(false);
    };

    useEffect(() => {
        const selectedItems = document.querySelectorAll('.id-list__item-selected');
        selectedItems.forEach(item => item.classList.remove('id-list__item-selected-last'));
        if (selectedItems.length > 0) {
            selectedItems[selectedItems.length - 1].classList.add('id-list__item-selected-last');
        }
    }, [selectedIds]);

    async function deleteSelectedOrders(idArr) {
        try {
            const response = await deleteOrders(idArr);
        } catch(e) {
            console.log(e);
        }
    };

    const highlightText = (searchTerm) => {
        const allElements = document.querySelectorAll('*');

        // Удаляем предыдущие выделения
        allElements.forEach(el => el.classList.remove('highlighted-text'));

        if (searchTerm) {
            for (let el of allElements) {
                if (el.textContent.toLowerCase() == searchTerm.toLowerCase()) {
                    el.classList.add('highlighted-text');
                }
            }
        }
    };

    return (
        <div id='orders'>
            <div className='orders__header-container'>
                <div className="orders__header">
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
            {isFilterOpen &&  
                <div className="filter">
                    <div className="filter__content" ref={filterRef}>
                        <div className="filter__content-wrapper">
                            <div className="filter__search">
                                <div className="filter__search-container">
                                    <div className="filter__search-img-container">
                                        <img src={search} alt="search" className="filter__search-img" />
                                    </div>
                                    {/* <input type="text" className="filter__search-input" placeholder='Поиск по системе' /> */}
                                    <input 
                                        type="text" 
                                        placeholder="Поиск..." 
                                        // value={searchTerm} 
                                        onChange={(e) => highlightText(e.target.value)} 
                                    />
                                    {/* <button onClick={
                                        () => {
                                            highlightText()
                                            setIsFilterOpen(false)
                                        }
                                    }>Найти</button> */}
                                    {/* <SearchableContent /> */}
                                </div>
                            </div>
                            <div className="filter__container">
                                <div className="filter__item">
                                    <p className="filter__text">Номер заказа</p>
                                    <FilterDropDownList 
                                        items={idList}
                                        onSelect={handleSelectedIids}
                                        isClear={isClearFDDlistSelectedItems}
                                        isClearDone={isClearDone}
                                    />
                                </div>
                                <div className="filter__item">
                                    <p className="filter__text">Дата</p>
                                    <input className='filter__input filter__input--date' type="date" ref={inputDateOrderRef}/>
                                </div>
                                <div className="filter__item">
                                    <p className="filter__text">Покупатель</p>
                                    <input className='filter__input filter__input--pokupatel' type="text" ref={inputPokupatelRef}/>
                                </div>
                                <div className="filter__item">
                                    <p className="filter__text">Статус</p>
                                    <FilterDropDownList 
                                        items={statusList} 
                                        onSelect={handleSelectedStatus} 
                                        isClear={isClearFDDlistSelectedItems}
                                        isClearDone={isClearDone}
                                    />
                                </div>
                                <div className="filter__item">
                                    <p className="filter__text">Тег</p>
                                    <FilterDropDownList 
                                        items={tagList} 
                                        onSelect={handleSelectedTag} 
                                        isClear={isClearFDDlistSelectedItems}
                                        isClearDone={isClearDone}
                                    />
                                </div>
                            </div>
                            <div className="filter-btn-container">
                                <PopularButton text={'Очистить всё'} isHover={true} onClick={() => clearSelectedItems()}/>
                                <PopularButton text={'Применить'} isHover={true} onClick={() =>{
                                    clearSelectedItems();
                                    handleFilterSelection();
                                    setIsFilterOpen(false);
                                    // console.log(inputDateOrderRef.current.value);
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="separator"></div>
            <OrderTable selectedColumns={selectedColumns} childValue={[handleCheckboxCount, handleIdList, handleStatusList, handleFetchData, handleTagList]} selectedFilterItems={selectedFilterItems} isFetchData={isFetchData}/>
        </div>
    )
}

export default Orders;