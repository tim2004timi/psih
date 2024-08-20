import React, { useEffect, useState } from 'react';
import '../../../../../node_modules/react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip'
import axios from "axios";
import './OrderTable.css';

const OrderTable = ({ selectedColumns }) => {
    const [data, setData] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({});

    const handleCheckboxChange = (rowId) => {
        console.log('Checkbox changed for rowId:', rowId);
        setCheckboxStates(prevState => ({
            ...prevState,
            [rowId]: !prevState[rowId]
        }));
    };

    async function fetchData() {
        try {
            const response = await axios.get('http://87.242.85.68:8000/orders/');
            setData(response.data);
            const initialCheckboxStates = response.data.reduce((acc, row) => {
                acc[row.id] = false;
                return acc;
            }, {});
            setCheckboxStates(initialCheckboxStates);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData()
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
                                onChange={() => handleCheckboxChange(row.id)}
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
                            <div className={`column-full_name__container ${isChecked ? 'highlighted-cell' : ''}`}>
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
                return (
                    row.status
                        ? 
                            <div className={`column-status__container ${isChecked ? 'highlighted-cell' : ''} ${getStatusStyle(row.status)}`}>
                                {row.status}
                            </div> 
                        :
                            null
                );
            }
        },  
    
        'сообщения': { 
            className: 'column-class column-messages', 
            content: (row) => row.messages
        },
    
        'тег': { 
            className: 'column-class column-tag', 
            content: (row) => (
                <div className="column-tag__container">
                    <div className="column-status__tag">{row.tag}</div>
                </div>
            )
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
            <table className="table">
                <thead>
                    <tr>{renderHeaders()}</tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </table>
            <Tooltip id="address-tooltip" />
            <Tooltip id="note-tooltip" />
            <Tooltip id="comment-tooltip" />
        </>
    );
};

export default OrderTable;