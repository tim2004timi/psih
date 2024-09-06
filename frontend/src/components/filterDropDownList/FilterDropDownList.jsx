import React, { useEffect, useState, useRef } from 'react';
import './FilterDropDownList.css';

const FilterDropDownList = ({ items, onSelect, isClear, isClearDone }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    const handleItemsSelection = (item) => {
        const newSelectedItems = selectedItems.includes(item) 
            ? selectedItems.filter(i => i !== item) 
            : [...selectedItems, item];

        setSelectedItems(newSelectedItems);
        onSelect(newSelectedItems); 
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

    useEffect(() => {
        if (isClear) {
            setSelectedItems([]);
            isClearDone();
        }
    }, [isClear, isClearDone]);

    return ( 
        <div className='filterdropdownlist'>
            <div className="filterdropdownlist__container"  ref={containerRef} onClick={() => {
                    setIsOpen(!isOpen);
                }}>
                <div className="filterdropdownlist__selectedId">
                    {selectedItems.length > 0 ? selectedItems.join(', ') : ''}
                </div>
                <button className='filterdropdownlist__content-btn'>
                    <span className={`filterdropdownlist__arrow ${isOpen ? 'filterdropdownlist__arrow-active' : ''}`}>
                        <span className='filterdropdownlist__arrow-btn'></span>
                        <span className='filterdropdownlist__arrow-btn'></span>
                    </span>
                </button>
            </div>
            {isOpen &&
                <div className="filterdropdownlist-list" ref={listRef}>
                    <div className="filterdropdownlist-list__content">
                            {[...selectedItems, ...items.filter(item => !selectedItems.includes(item))].map(item=> (
                                <button 
                                    key={item} 
                                    className={`filterdropdownlist-list__item ${selectedItems.includes(item) ? 'filterdropdownlist-list__item-selected' : ''}`} 
                                    onClick={() => handleItemsSelection(item)}
                                >
                                    {item}
                                </button>
                            ))}
                    </div>
                </div>
            }
        </div>
     );
}
 
export default FilterDropDownList;