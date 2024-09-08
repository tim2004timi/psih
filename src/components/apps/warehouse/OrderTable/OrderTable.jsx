import React, { useEffect, useState } from 'react';
import '../../../../../node_modules/react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip'
import axios from "axios";
import './OrderTable.css';
import SelectionArea from '../../../selectionArea/SelectionArea';
const OrderTable = ({ selectedColumns, childValue }) => {
    const [data, setData] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({});
    const [showStatusList, setShowStatusList] = useState(false);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
    let initialCheckboxStates;
    const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
    const [uniqueStatuses, setUniqueStatuses] = useState(new Set());
    const [handleCheckboxCount, handleIdList, handleStatusList] = childValue;

    const handleCheckboxChange = (rowId, event) => {
        setLastSelectedIndex(rowId);
    
        let countChange = 0;
    
        setCheckboxStates(prevState => {
            let upFlag;
            const newState = { ...prevState };
    
            if (event.shiftKey) {
                const start = Math.min(lastSelectedIndex, rowId);
                const end = Math.max(lastSelectedIndex, rowId);

                if (start == rowId) {
                    upFlag = false;
                } else {
                    upFlag = true;
                }
                
                if (upFlag) {
                    for (let i = start + 1; i <= end; i++) {
                        if (newState[i] !== undefined) {
                            newState[i] = !newState[i];
                            countChange += newState[i] ? 1 : -1;
                        }
                    }
                } else {
                    for (let i = start; i < end; i++) {
                        if (newState[i] !== undefined) {
                            newState[i] = !newState[i];
                            countChange += newState[i] ? 1 : -1;
                        }
                    }
                }

            } else {
                const wasChecked = newState[rowId] || false;
                newState[rowId] = !wasChecked;
                countChange += newState[rowId] ? 1 : -1;
            }
    
            return newState;
        });
    
        setActiveCheckboxCount(prevCount => prevCount + countChange);
    };
    
    useEffect(() => {
        handleCheckboxCount(Math.floor(activeCheckboxCount/2));
    }, [activeCheckboxCount]);

    async function fetchData() {
        try {
            const response = await axios.get('http://87.242.85.68:8000/orders/');
            setData(response.data);
            initialCheckboxStates = response.data.reduce((acc, row) => {
                acc[row.id] = false;
                return acc;
            }, {});
            setCheckboxStates(initialCheckboxStates);
            const ids = response.data.map(row => row.id);
            handleIdList(ids);
            const statuses = new Set(response.data.map(row => row.status));
            setUniqueStatuses(statuses);
            handleStatusList(Array.from(statuses))
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData()

        const handleDocumentClick = (event) => {
            if (!event.target.closest('.table')) {
                setCheckboxStates(initialCheckboxStates);
                setActiveCheckboxCount(0);
            }
        };
    
        document.addEventListener('click', handleDocumentClick);
    
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'в обработке':
                return "column-status__in-process"
            case 'возврат':
                return "column-status__refund"
            case 'доставлен':
                return "column-status__delivered"
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://87.242.85.68:8000/orders/?order_id=${orderId}`, { status: newStatus });
            setData(prevData => prevData.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
            setShowStatusList(prev => ({ ...prev, [orderId]: false }));

            setUniqueStatuses(prevStatuses => {
                const newStatuses = new Set(prevStatuses);
                newStatuses.add(newStatus);
                handleStatusList(Array.from(newStatuses));
                return newStatuses;
            });
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const renderStatusList = (row) => {
        return (
            <div className="column-status__list-container">
                <div className="column-status__list">
                    <button className="column-status__in-process" onClick={() => updateOrderStatus(row.id, 'в обработке')}>в обработке</button>
                    <button className="column-status__refund" onClick={() => updateOrderStatus(row.id, 'возврат')}>возврат</button>
                    <button className="column-status__delivered" onClick={() => updateOrderStatus(row.id, 'доставлен')}>доставлен</button>
                </div>
            </div>
        )
    }

    const columnConfig = {
        '№': {
            className: 'column-class column-number', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    <div className={`column-number__container ${isChecked ? 'highlighted-cell' : ''}`}>
                        <div className="column-number-input__container">
                            <input
                                type="checkbox"
                                className="column-number-input"
                                checked={isChecked}
                                onClick={(event) => handleCheckboxChange(row.id, event)}
                                readOnly
                            />
                        </div>
                        <div className="column-number-content__container">
                            {row.id}
                        </div>
                    </div>
                );
            }
        },
    
        'дата': { 
            className: 'column-class column-date', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    row.date 
                        ? 
                            <div className={`column-date__container ${isChecked ? 'highlighted-cell' : ''}`}>
                                {row.date}
                            </div> 
                        :
                            null
                );
            }
        },
    
        'покупатель': { 
            className: 'column-class column-full_name', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    row.full_name
                        ? 
                            <div className={`column-full_name__container ${isChecked ? 'highlighted-cell' : ''}`} data-tooltip-id="full_name-tooltip" data-tooltip-content={row.full_name}>
                                {row.full_name}
                            </div> 
                        :
                            null
                );
            }
        }, 
    
        'статус': { 
            className: 'column-class column-status', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return row.status ? (
                    <div>
                        <button className={`column-status__container ${isChecked ? 'highlighted-cell' : ''} ${getStatusStyle(row.status)}`} onClick={() => setShowStatusList(prev => ({ ...prev, [row.id]: !prev[row.id] }))}>
                            {row.status}
                        </button>
                        {showStatusList[row.id] && (
                            renderStatusList(row)
                        )}
                    </div>
                ) : null;
            }
        }, 
    
        'сообщения': { 
            className: 'column-class column-messages', 
            content: (row) => row.messages
        },
    
        'тег': { 
            className: 'column-class column-tag', 
            content: (row) => row.tag != 'null' ? (
                <div className="column-tag__container">
                    <div className="column-status__tag">{row.tag}</div>
                </div>
            ) : null
        },
    
        'сумма': { 
            className: 'column-class column-summ', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    <div className={`column-summ__container ${isChecked ? 'highlighted-cell' : ''}`}>
                        {row.summ}
                    </div> 
                );
            }
        },
    
        'канал продаж': { 
            className: 'column-class column-channel', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    row.channel
                        ? 
                            <div className={`column-channel__container ${isChecked ? 'highlighted-cell' : ''}`}>
                                {row.channel}
                            </div> 
                        :
                            null
                );
            }
        },
    
        'адрес доставки': { 
            className: 'column-class column-address', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    row.address
                        ? 
                            <div 
                                className={`column-address__container ${isChecked ? 'highlighted-cell' : ''}`}
                                data-tooltip-id="address-tooltip" 
                                data-tooltip-content={row.address}
                            >
                                {row.address}
                            </div> 
                        :
                            null
                );
            }
        },
    
        'доставка': { 
            className: 'column-class column-storage', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    row.storage
                        ? 
                            <div className={`column-storage__container ${isChecked ? 'highlighted-cell' : ''}`}>
                                {row.storage}
                            </div> 
                        :
                            null
                );
            }
        },
    
        'заметки': { 
            className: 'column-class column-note', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    row.note
                        ? 
                            <div 
                                className={`column-note__container ${isChecked ? 'highlighted-cell' : ''}`}
                                data-tooltip-id="note-tooltip" 
                                data-tooltip-content={row.note}
                            >
                                {row.note}
                            </div> 
                        :
                            null
                );
            }
        },
    
        'комментарий': { 
            className: 'column-class column-comment', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    row.comment
                        ? 
                            <div 
                                className={`column-comment__container ${isChecked ? 'highlighted-cell' : ''}`}
                                data-tooltip-id="comment-tooltip" 
                                data-tooltip-content={row.comment}
                            >
                                {row.comment}
                            </div> 
                        :
                            null
                );
            }
        },
    
        'телефон': { 
            className: 'column-class column-phone_number', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    row.phone_number
                        ? 
                            <div className={`column-phone_number__container ${isChecked ? 'highlighted-cell' : ''}`}>
                                {row.phone_number}
                            </div> 
                        :
                            null
                );
            }
        },
    
        'почта': { 
            className: 'column-class column-email', 
            content: (row) => {
                const isChecked = checkboxStates[row.id] || false;
                return (
                    row.email
                        ? 
                            <div className={`column-email__container ${isChecked ? 'highlighted-cell' : ''}`}>
                                {row.email}
                            </div> 
                        :
                            null
                );
            }
        }
    };

    const renderHeaders = () => {
        return selectedColumns.map((column, index) => (
            <th key={index} className='column-header'>{column}</th>
        ));
    };

    const renderRows = () => {
        return data.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {selectedColumns.map((column, colIndex) => {
                    const className = columnConfig[column]?.className;
                    return (
                        <td 
                            key={colIndex} 
                            className={className}>
                            {columnConfig[column]?.content(row)}
                        </td>
                    );
                })}
            </tr>
        ));
    };
    
    return (
        <>
           {/* <SelectionArea > */}
            <table className="table">
                <thead>
                    <tr>{renderHeaders()}</tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </table>
            <Tooltip id="full_name-tooltip" />
            <Tooltip id="address-tooltip" />
            <Tooltip id="note-tooltip" />
            <Tooltip id="comment-tooltip" />
          {/* </SelectionArea > */}
        </>
    );
};

export default OrderTable;