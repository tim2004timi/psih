import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import PopularButton from "../../../../popularButton/PopularButton";
import szhatie from "../../../../../assets/img/szhatie-strok.png";
import editor from "../../../../../assets/img/editor-btn.png";
import deleteTable from "../../../../../assets/img/delete-table.png";
import settings from "../../../../../assets/img/table-settings.svg";
import search from "../../../../../assets/img/search_btn.svg";
import './Remains.css';
import FilterDropDownList from "../../../../filterDropDownList/FilterDropDownList";

const Remains = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);

  const [selectedColumns, setSelectedColumns] = useState([
    "наименование",
    "остаток",
    "предзаказ",
    "себестоимость",
    "сумма продажи",
  ]);
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

  const [isClearFDDlistSelectedItems, setIsClearFDDlistSelectedItems] =
    useState(false);

  const inputPokupatelRef = useRef(null);

  const inputDateOrderRef = useRef(null);

  const warehouseTableBtnContainerRef = useRef(null);

  const columns = [
    "наименование",
    "остаток",
    "предзаказ",
    "себестоимость",
    "сумма продажи",
  ];

  const showFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleOutsideClick = (event) => {
    if (filterBtnRef.current && filterBtnRef.current.contains(event.target)) {
      return;
    }

    if (filterRef.current && !filterRef.current.contains(event.target)) {
      showFilter(false);
    }

    if (
      columnsListBtnRef.current &&
      columnsListBtnRef.current.contains(event.target)
    ) {
      return;
    }

    if (
      columnsListRef.current &&
      !columnsListRef.current.contains(event.target) &&
      event.target !== columnsListRef.current
    ) {
      setShowColumnList(false);
    }

  };

  useEffect(() => {
    if (isFilterOpen || showColumnList) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isFilterOpen, showColumnList]);

  const handleColumnSelect = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
    } else {
      let inserted = false;
      const newSelectedColumns = selectedColumns.reduce(
        (acc, selectedColumn) => {
          if (
            columns.indexOf(column) < columns.indexOf(selectedColumn) &&
            !inserted
          ) {
            acc.push(column);
            inserted = true;
          }
          acc.push(selectedColumn);
          return acc;
        },
        []
      );

      if (!inserted) {
        newSelectedColumns.push(column);
      }

      setSelectedColumns(newSelectedColumns);
    }
  };

  const columnConfig = {
    наименование: {
      className: "remains-column column-remains-name",
      content: (row) => {
        let isChecked = true;
        return row.name && (
            <div
              className={`remains-column-container column-name__container ${
                isChecked ? "remains-colums-selected" : ""
              }`}
            >
              {row.name}
            </div>
        );
      },
    },
    остаток: {
      className: "remains-column column-remains",
      content: (row) => {
        let isChecked = true;
        return row.remains && (
          <div
            className={`remains-column-container column-remains__container ${
              isChecked ? "remains-colums-selected" : ""
            }`}
          >
            {row.remains}
          </div>
        );
      },
    },
    предзаказ: {
      className: "remains-column column-preorder",
      content: (row) => {
        let isChecked = true;
        return row.preorder != undefined ? (
            <div
              className={`remains-column-container column-prеorder__container ${
                isChecked ? "remains-colums-selected" : ""
              }`}
            >
              {row.preorder}
            </div>
          ) : null;
      },
    },
    себестоимость: {
      className: "remains-column column-cost-price",
      content: (row) => {
        let isChecked = true;
        return row.cost_price && (
            <div
              className={`remains-column-container column-cost-price__container ${
                isChecked ? "remains-colums-selected" : ""
              }`}
            >
              {row.cost_price}
            </div>
          );
      },
    },
    "сумма продажи": {
      className: "remains-column column-sum",
      content: (row) => {
        return row.sum && (
          <div
            className={`remains-column-container column-sum__container`}
          >
            {row.sum}
          </div>
        );
      },
    },
  };

  const renderHeaders = () => {
    return selectedColumns.map((column, index) => (
      <th key={index} className="remains-column-header">
        {column}
      </th>
    ));
  };

  const mocData = [
        // {
        // "наименование": "Товар 1",
        // 'остаток': 100,
        // 'предзаказ': 0,
        // 'себестоимость': 100,
        // "сумма продажи": 1000,
        // },
        {
        "name": "Товар 2",
        'remains': 200,
        'preorder': 0,
        'cost_price': 200,
        "sum": 2000,
        },
        {
        "name": "Товар 3",
        'remains': 300,
        'preorder': 0,
        'cost_price': 300,
        "sum": 3000,
        },
    ]
    const renderRows = () => {
        return mocData.map((row, rowIndex) => (
          <tr key={rowIndex}>
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
            <button
              className="warehouse-page__btn-filter"
              onClick={showFilter}
              ref={filterBtnRef}
            >
              Фильтр
            </button>
          </div>
          <div
            className="warehouse-table-btn__container"
            ref={warehouseTableBtnContainerRef}
          >
            <div className="warehouse-table-btn__counter">
              {activeCheckboxCount}
            </div>
            <button className="warehouse-table-btn warehouse-table-btn__szhatie">
              <img
                className="warehouse-table-btn__img"
                src={szhatie}
                alt="szhatie"
              />
            </button>
            <button className="warehouse-table-btn warehouse-table-btn__editor">
              <img className="orderTable-btn__img" src={editor} alt="editor" />
            </button>
            <button
              className="warehouse-table-btn warehouse-table-btn__delete-table"
              onClick={() => {
                deleteSelectedOrders(activeCheckboxIds);
                setIsFetchData(true);
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
              setShowColumnList(!showColumnList);
            }}
          >
            <img
              className="warehouse-table__settings-img"
              src={settings}
              alt="settings"
            />
            {/* <img className='orderTable__settings-img--hover' src={settingsHover} alt="settings" /> */}
          </button>
          {showColumnList && (
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
          )}
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
                  <p className="filter__text">Наименование</p>
                  <input
                    className="filter__input filter__input--pokupatel"
                    type="text"
                    ref={inputPokupatelRef}
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Остаток</p>
                  <FilterDropDownList
                    
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Предзаказ</p>
                  <FilterDropDownList
                 
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Себестоимость</p>
                  <FilterDropDownList
                   
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Сумма продажи</p>
                  <FilterDropDownList
                   
                  />
                </div>
              </div>
              <div className="filter-btn-container">
                <PopularButton
                  text="Очистить всё"
                  isHover={true}
                  onClick={() => clearSelectedItems()}
                />
                <PopularButton
                  text={"Применить"}
                  isHover={true}
                  onClick={() => {
                    clearSelectedItems();
                    handleFilterSelection();
                    setIsFilterOpen(false);
                    // console.log(inputDateOrderRef.current.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="separator"></div>
      <table className="remains-table">
        <thead>
          <tr>{renderHeaders()}</tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </>
  );
};

export default Remains;
