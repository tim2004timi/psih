import React, { useState, useRef, useEffect } from "react";
import PartiesTable from "../../partiesTable/PartiesTable";
import PopularButton from "../../../../popularButton/PopularButton";
import deleteTable from "../../../../../assets/img/delete-table.png";
import { Link } from "react-router-dom";
import FilterDropDownList from "../../../../filterDropDownList/FilterDropDownList";
import OrderData from "../neworder/orderDetails/OrderData";
import NotificationManager from "../../../../notificationManager/NotificationManager";
import NotificationStore from "../../../../../NotificationStore";
import { observer } from "mobx-react-lite";
import PartyStore from "../../../../../PartyStore";
import { Tooltip } from "react-tooltip";
import { formatDateTime } from "../../../../../API/formateDateTime";

const Parties = observer(() => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);

  const [checkboxStates, setCheckboxStates] = useState({});
  const [showStatusList, setShowStatusList] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  let initialCheckboxStates;
  const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
  const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);

  const [editableFields, setEditableFields] = useState({});

  const [isNewOrder, setIsNewOrder] = useState(false);

  const inputPokupatelRef = useRef(null);

  const inputDateOrderRef = useRef(null);

  const warehouseTableBtnContainerRef = useRef(null);

  const searchableContentRef = useRef(null);

  const newOrderRef = useRef(null);

  const columnsListBtnRef = useRef(null);

  const { parties, getParties } = PartyStore

  const [selectedColumns, setSelectedColumns] = useState([
    "№",
    "дата",
    "поставщик",
    "статус",
    "тег",
    "сумма",
  ]);
  const [showColumnList, setShowColumnList] = useState(false);
  const columnsListRef = useRef(null);
  const columns = [
    "№",
    "дата",
    "поставщик",
    "статус",
    "тег",
    "сумма",
  ];

  const { errorText, successText, setErrorText, setSuccessText, resetErrorText, resetSuccessText } = NotificationStore;

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

    const getStatusStyle = (status) => {
    switch (status) {
        case "в обработке":
        return "column-status__in-process";
        case "возврат":
        return "column-status__refund";
        case "доставлен":
        return "column-status__delivered";
    }
    };

    useEffect(() => {
      getParties();
    //   console.log(parties);
    }, []);

    // useEffect(() => {
    //     console.log(parties)
    // }, [parties])

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

  return (
    <>
      <div className="warehouse-page__header">
        <div className="warehouse-page__header-container">
          <div className="warehouse-page__btn-container">
            {/* <PopularButton text={'Фильтр'} isHover={true} onClick={openFilter} /> */}
            <button
              className="warehouse-page__btn-filter"
              //   onClick={showFilter}
              //   ref={filterBtnRef}
            >
              Фильтр
            </button>
            <PopularButton
              text={"+ Заказ"}
              isHover={true}
              //   onClick={() => setIsNewOrder((isNewOrder) => !isNewOrder)}
            />
            {/* {isNewOrder && (
              <OrderData
                configName="newOrderConfig"
                // showNewOrder={setIsNewOrder}
              />
            )} */}
            {/* <div className="search">
              <div className="search__btn">
                <button
                  className="search__btn-button"
                  onClick={() =>
                    (searchableContentRef.current.style.display = "flex")
                  }
                >
                  <img src={search} alt="" className="search__btn-img" />
                </button>
              </div>
              <div className="searchable-content" ref={searchableContentRef}>
                <div className="searchable-content__separator"></div>
                <input
                  type="text"
                  className="searchable-content__input"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={() => searchAndHighlight(searchTerm)}
                  className="searchButtonClickText_h"
                >
                  Search
                </button>
                <div className="searchable-content__wrapper">
                  <button
                    className="searchable-content__btn"
                    onClick={handlePrevious}
                  >
                    <img
                      src={up_btn}
                      alt="up"
                      className="searchable-content__img"
                    />
                  </button>
                  <button
                    className="searchable-content__btn"
                    onClick={handleNext}
                  >
                    <img
                      src={down_btn}
                      alt="down"
                      className="searchable-content__img"
                    />
                  </button>
                  <button
                    className="searchable-content__btn"
                    onClick={() => {
                      setSearchTerm("");
                      clearHighlights();
                      searchableContentRef.current.style.display = "none";
                    }}
                  >
                    <img
                      src={close}
                      alt="close"
                      className="searchable-content__img--close"
                    />
                  </button>
                </div>
              </div>
            </div> */}
          </div>
          <div
            className="warehouse-table-btn__container"
            ref={warehouseTableBtnContainerRef}
          >
            <div className="warehouse-table-btn__counter">
              {/* {activeCheckboxCount} */}
            </div>
            {/* <button className="warehouse-table-btn warehouse-table-btn__szhatie">
              <img
                className="warehouse-table-btn__img"
                src={szhatie}
                alt="szhatie"
              />
            </button>
            <button className="warehouse-table-btn warehouse-table-btn__editor">
              <img className="orderTable-btn__img" src={editor} alt="editor" />
            </button> */}
            <button
              className="warehouse-table-btn warehouse-table-btn__delete-table"
              onClick={() => {
                // deleteSelectedOrders(activeCheckboxIds);
                // setIsFetchData(true);
              }}
            >
              <img
                className="warehouse-table-btn__img"
                src={deleteTable}
                alt="deleteTable"
              />
            </button>
          </div>
          <button
            className="warehouse-table__settings-btn"
            ref={columnsListBtnRef}
            onClick={() => {
              //   setShowColumnList(!showColumnList);
            }}
          ></button>
          {/* {showColumnList && (
            <div className="warehouse-table__settings" ref={columnsListRef}>
              {columns.map((column, index) => (
                <div
                  key={index}
                  className="warehouse-table__settings-container"
                >
                  <label className="warehouse-table__settings-item">
                    <div className="warehouse-table__settings-content">
                      {column}
                    </div>
                    <div className="warehouse-table__settings-input">
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
          )} */}
        </div>
        <div className="separator"></div>
      </div>
      {isFilterOpen && (
        <div className="filter">
          <div className="filter__content" ref={filterRef}>
            <div className="filter__content-wrapper">
              <div className="filter__search">
                <div className="filter__search-container">
                  <div className="filter__search-img-container">
                    <img
                      src={search}
                      alt="search"
                      className="filter__search-img"
                    />
                  </div>
                  {/* <input type="text" className="filter__search-input" placeholder='Поиск по системе' /> */}
                  <input
                    type="text"
                    placeholder="Поиск..."
                    // value={searchTerm}
                    // onChange={(e) => highlightText(e.target.value)}
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
                  <FilterDropDownList />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Дата</p>
                  <input
                    className="filter__input filter__input--date"
                    type="date"
                    ref={inputDateOrderRef}
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Покупатель</p>
                  <input
                    className="filter__input filter__input--pokupatel"
                    type="text"
                    ref={inputPokupatelRef}
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Статус</p>
                  <FilterDropDownList />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Тег</p>
                  <FilterDropDownList />
                </div>
              </div>
              <div className="filter-btn-container">
                <PopularButton
                  text={"Очистить всё"}
                  isHover={true}
                  //   onClick={() => clearSelectedItems()}
                />
                <PopularButton
                  text={"Применить"}
                  isHover={true}
                  //   onClick={() => {
                  //     handleFilterSelection();
                  //     clearSelectedItems();
                  //     setIsFilterOpen(false);
                  //     // console.log(inputDateOrderRef.current.value);
                  //   }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="separator"></div>
      <table className="table">
        <thead className="table-header">
          <tr>{renderHeaders()}</tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      <Tooltip id="full_name-tooltip" />
      {/* <Tooltip id="phone_number-tooltip" /> */}
      <Tooltip id="storage-tooltip" />
      <Tooltip id="address-tooltip" />
      <Tooltip id="note-tooltip" />
      <Tooltip id="comment-tooltip" />
      <Tooltip id="email-tooltip" />
      {errorText && <NotificationManager errorMessage={errorText} resetFunc={resetErrorText}/>}
      {successText && <NotificationManager successMessage={successText} resetFunc={resetSuccessText} />}
    </>
  );
});

export default Parties;
