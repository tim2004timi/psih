import React, { useEffect, useState } from 'react';
import axios from "axios";
import './OrderTable.css';

const OrderTable = ({ selectedColumns }) => {
    const [data, setData] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({});

    const handleCheckboxChange = (rowId) => {
        setCheckboxStates(prevState => ({
            ...prevState,
            [rowId]: !prevState[rowId]
        }));
    };

    async function fetchData() {
        try {
            const response = await axios.get('http://87.242.85.68:8000/orders/');
            setData(response.data);
            // Инициализируем состояние чекбоксов для каждой строки
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

    const columnConfig = {
        '№': {
            className: 'column-class column-number', 
            content: (row) => 
                <div className="column-number__container">
                    <div className="column-number-input__container">
                        <input
                            type="checkbox"
                            className="column-number-input"
                            checked={checkboxStates[row.id] || false}
                            onChange={() => handleCheckboxChange(row.id)}
                        />
                        <span className="column-number-input__custom"></span>
                    </div>
                    <div className="column-number-content__container">
                        {row.id}
                    </div>
                </div>
        },

        'дата': { 
            className: 'column-class column-date', 
            content: (row) => row.date
        },

        'покупатель': { 
            className: 'column-class column-full_name', 
            content: (row) => row.full_name
        }, 

        'статус': { 
            className: 'column-class column-status', 
            content: (row) => 
                // <div className="column-status__container">
                //     {if (row.status == 'в обработке') {
                //         return (
                //             <div className="column-status__processing">
                //         )
                //     }
                    row.status
                // </div>
        },  

        'сообщения': { 
            className: 'column-class column-messages', 
            content: (row) => row.messages
        },

        'тег': { 
            className: 'column-class column-tag', 
            content: (row) => row.tag 
        },

        'сумма': { 
            className: 'column-class column-summ', 
            content: (row) => row.summ
        },

        'канал продаж': { 
            className: 'column-class column-channel', 
            content: (row) => row.channel
        },

        'адрес доставки': { 
            className: 'column-class column-address', 
            content: (row) => row.address
        },

        'доставка': { 
            className: 'column-class column-storage', 
            content: (row) => row.j
        },

        'заметки': { 
            className: 'column-class column-note', 
            content: (row) => row.note
        },

        'комментарий': { 
            className: 'column-class column-comment', 
            content: (row) => row.comment
        },

        'телефон': { 
            className: 'column-class column-phone_number', 
            content: (row) => row.phone_number
        },

        'почта': { 
            className: 'column-class column-email', 
            content: (row) => row.email
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
                    const isChecked = checkboxStates[row.id] || false;
                    const className = `${columnConfig[column]?.className} ${isChecked ? 'highlighted-cell' : ''}`;
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
        <div>
            <table className="table">
                <thead>
                    <tr>{renderHeaders()}</tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </table>
        </div>
    );
};

export default OrderTable;