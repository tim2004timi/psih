import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import PartyStore from "../../../../PartyStore";

const PartiesTable = observer(() => {
    const { parties, getParties } = PartyStore

    const columnConfig = {
        "№": {
          className: "column-class column-number",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.id != null && (
              <div
                className={`column-number__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
              >
                <div className={`column-number-input__container`}>
                  <input
                    type="checkbox"
                    className="column-number-input"
                    checked={isChecked}
                    readOnly
                  />
                  <span
                    className="column-number-input__custom"
                    onClick={(event) => {
                      handleCheckboxChange(row.id, event);
                      event.preventDefault();
                    }}
                  ></span>
                </div>
                <div className="column-number-link">
                  <Link className="column-number-link-link" to={`/orders/${row.id}`}>
                    {row.id}
                  </Link>
                </div>
              </div>
            );
          },
        },
    
        дата: {
          className: "column-class column-date",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            const date = formatDateTime(row.order_date);
            return (
              row.order_date != null && (
                <div
                  className={`column-date__container ${
                    isChecked ? "highlighted-cell" : ""
                  }`}
                >
                  {date}
                </div>
              )
            );
          },
        },
    
        покупатель: {
          className: "column-class column-full_name",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.full_name != null ? (
              <div
                className={`column-full_name__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
                data-tooltip-id="full_name-tooltip"
                data-tooltip-content={row.full_name}
              >
                {row.full_name}
              </div>
            ) : null;
          },
        },
    
        статус: {
          className: "column-class column-status",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return (
              row.status != null && (
                <div>
                  <button
                    className={`column-status__container ${
                      isChecked ? "highlighted-cell" : ""
                    } ${getStatusStyle(row.status)}`}
                    onClick={() =>
                      setShowStatusList((prev) => ({
                        ...prev,
                        [row.id]: !prev[row.id],
                      }))
                    }
                  >
                    {row.status}
                  </button>
                  {showStatusList[row.id] && renderStatusList(row)}
                </div>
              )
            );
          },
        },
    
        сообщения: {
          className: "column-class column-messages",
          content: (row) => row.messages,
        },
    
        тег: {
          className: "column-class column-tag",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return (
              row.tag != null && (
                <div
                  className={`column-tag__container ${
                    isChecked ? "highlighted-cell" : ""
                  }`}
                >
                  {row.tag}
                </div>
              )
            );
          },
        },
    
        сумма: {
          className: "column-class column-summ",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.summ != null && (
              <div
                className={`column-summ__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
              >
                {row.summ + " ₽"}
              </div>
            );
          },
        },
    
        "канал продаж": {
          className: "column-class column-channel",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.channel != null && (
              <div
                className={`column-channel__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
                data-tooltip-id="channel-tooltip"
                data-tooltip-content={row.channel}
              >
                {row.channel}
              </div>
            );
          },
        },
    
        "адрес доставки": {
          className: "column-class column-address",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.address != null && (
              <div
                className={`column-address__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
                data-tooltip-id="address-tooltip"
                data-tooltip-content={row.address}
              >
                {row.address}
              </div>
            );
          },
        },
    
        доставка: {
          className: "column-class column-storage",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.storage != null && (
              <div
                className={`column-storage__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
                data-tooltip-id="storage-tooltip"
                data-tooltip-content={row.storage}
              >
                {row.storage}
              </div>
            );
          },
        },
    
        заметки: {
          className: "column-class column-note",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.note != null && (
              <div
                className={`column-note__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
                data-tooltip-id="note-tooltip"
                data-tooltip-content={row.note}
              >
                {row.note}
              </div>
            );
          },
        },
    
        комментарий: {
          className: "column-class column-comment",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.comment != null && (
              <div
                className={`column-comment__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
                data-tooltip-id="comment-tooltip"
                data-tooltip-content={row.comment}
              >
                {row.comment}
              </div>
            );
          },
        },
    
        телефон: {
          className: "column-class column-phone_number",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.phone_number != null && (
              <div
                className={`column-phone_number__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
                data-tooltip-id="phone_number-tooltip"
                data-tooltip-content={row.phone_number}
              >
                {row.phone_number}
              </div>
            );
          },
        },
    
        почта: {
          className: "column-class column-email",
          content: (row) => {
            const isChecked = checkboxStates[row.id] || false;
            return row.email != null && (
              <div
                className={`column-email__container ${
                  isChecked ? "highlighted-cell" : ""
                }`}
                data-tooltip-id="email-tooltip"
                data-tooltip-content={row.email}
              >
                {row.email}
              </div>
            );
          },
        },
      };

    useEffect(() => {
      getParties();
    //   console.log(parties);
    }, []);

    useEffect(() => {
        console.log(parties)
    }, [parties])

    const renderHeaders = () => {
        return selectedColumns.map((column, index) => (
          <th key={index} className="column-header">
            {column}
          </th>
        ));
      };
    
      // useEffect(() => {
      //   console.log(selectedFilterItems.order_date)
      //   // console.log(row.order_date)
      // }, [selectedFilterItems]);
    
      const renderRows = () => {
        return parties
        //   .filter((row) => {
        //     if (Object.keys(selectedFilterItems).length === 0) {
        //       return true;
        //     }
    
        //     let date;
    
        //     if (selectedFilterItems.order_date.length !== 0) {
        //       date = formatDateTime(selectedFilterItems.order_date);
        //     }
    
        //     const idMatches =
        //       selectedFilterItems.id.length === 0 ||
        //       selectedFilterItems.id.includes(row.id);
        //     const statusMatches =
        //       selectedFilterItems.status.length === 0 ||
        //       selectedFilterItems.status.includes(row.status);
        //     const nameMatches =
        //       selectedFilterItems.full_name.length === 0 ||
        //       row.full_name.includes(selectedFilterItems.full_name);
        //     const tagMatches =
        //       selectedFilterItems.tag.length === 0 ||
        //       selectedFilterItems.tag.includes(row.tag);
    
        //     if (selectedFilterItems.order_date.length !== 0) {
        //       const filterDate = new Date(selectedFilterItems.order_date);
        //       const rowDate = new Date(row.order_date);
    
        //       const dateMatches =
        //         formatDateTime(filterDate) === formatDateTime(rowDate);
    
        //       return (
        //         idMatches &&
        //         statusMatches &&
        //         nameMatches &&
        //         tagMatches &&
        //         dateMatches
        //       );
        //     }
    
        //     return idMatches && statusMatches && nameMatches && tagMatches;
        //   })
          .map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {selectedColumns.map((column, colIndex) => {
                const className = columnConfig[column]?.className;
                return (
                  <td key={colIndex} className={className}>
                    {columnConfig[column]?.content(row)}
                  </td>
                );
              })}
            </tr>
          ));
      };
})

export default PartiesTable;