import React, { useState, useEffect, useRef } from 'react';
import './DropDownList.css';
import { Link } from 'react-router-dom';
import { patchOrder } from '../../API/ordersAPI';

const DropDownList = ({ selectedItemText, items, isItemLink, startItem, statusList, rowId, tagClass, statusObj, tagObj, currentPage }) => {
    const localStartItem = currentPage === 'orders' ? 'новый заказ' : 'новый товар';
    const [selectedItem, setSelectedItem] = useState(startItem || localStartItem);
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (containerRef.current && listRef.current) {
            listRef.current.style.width = `${containerRef.current.offsetWidth}px`;
        }
    }, [isOpen]);

    const handleSelection = (item) => {
        setSelectedItem(currentPage === 'orders' ? item : item.name);
        setIsOpen(false)
    };

    useEffect(() => {
        if (startItem) {
            setSelectedItem(startItem);
        }
    }, [startItem]);

    const updateOrderField = async (field, newValue) => {
        if (startItem !== `статус заказа` && field === 'status') {
            console.log('статус')
            try {
                const response = await patchOrder(rowId, field, newValue);
                setSelectedItem(response.data[field]);
            } catch (error) {
                console.error(error);
            }
        } else if (startItem !== 'тег' && field === 'tag') {
            try {
                const response = await patchOrder(rowId, field, newValue);
                setSelectedItem(response.data[field]);
            } catch (error) {
                console.error(error);
            }
        } else {
            if (field === 'status') {
                statusObj({ [field]: newValue });
            } else if (field === 'tag') {
                tagObj({ [field]: newValue });
            }
            setSelectedItem(newValue);
        }
        setIsOpen(false)
    };

    const handleDropddownListOutsideClick = (e) => {
      
        if (containerRef.current && !containerRef.current.contains(e.target) && listRef.current && !listRef.current.contains(e.target)) {
            setIsOpen(false);
        }

    }

    useEffect(() => {

        if (isOpen) {
            document.addEventListener('mousedown', handleDropddownListOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleDropddownListOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleDropddownListOutsideClick);
        }

    }, [isOpen]);

    return (
        <div className='dropdownlist'>
            <div className={`dropdownlist__container`} ref={containerRef} onClick={() => {
                setIsOpen(!isOpen)
            }}>
                <div className="dropdownlist__container-selectedItem">
                    {startItem && selectedItemText ? selectedItemText + selectedItem : '' + selectedItem}
                </div>
                <button className='dropdownlist-btn'>
                    <span className={`dropdownlist__arrow ${isOpen ? 'dropdownlist__arrow-active' : ''}`}>
                        <span className='dropdownlist__arrow-btn'></span>
                        <span className='dropdownlist__arrow-btn'></span>
                    </span>
                </button>
            </div>
            {isOpen && (
                !statusList ? (
                    <div className={`dropdownlist-list ${tagClass ? 'dropdownlist-list-tagClass' : ''}`} ref={listRef}>
                        <div className="dropdownlist-list__content">
                            {items.map(item => (
                                isItemLink ? (
                                    <Link
                                        key={`${currentPage === 'orders' ? item : item.id}`}
                                        to={`${currentPage === 'orders' ? `/orders/${item}` : `/products/${item.id}`}`}
                                        className={`dropdownlist-list__item`}
                                        onClick={() => handleSelection(item)}
                                    >
                                        {`${currentPage === 'orders' ? item : item.name}`}
                                    </Link>
                                ) : (
                                    <button
                                        key={item}
                                        className={`dropdownlist-list__item`}
                                        onClick={() => tagClass ? updateOrderField('tag', item) : handleSelection(item)}
                                    >
                                        {item}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="dropdownlist-status__list-container" ref={listRef}>
                        <div className="dropdownlist-status__list">
                            <button className="dropdownlist-status__in-process" onClick={() => updateOrderField('status', 'в обработке')}>в обработке</button>
                            <button className="dropdownlist-status__refund" onClick={() => updateOrderField('status', 'возврат')}>возврат</button>
                            <button className="dropdownlist-status__delivered" onClick={() => updateOrderField('status', 'доставлен')}>доставлен</button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default DropDownList;