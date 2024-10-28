import React, { useState, useRef, useEffect } from "react";
import "./Orders.css";
import PopularButton from "../../../../popularButton/PopularButton";
import search from "../../../../../assets/img/search_btn.svg";
import settings from "../../../../../assets/img/table-settings.svg";
import settingsHover from "../../../../../assets/img/settings_hover.svg";
import deleteTable from "../../../../../assets/img/delete-table.png";
import { Link } from "react-router-dom";
import OrderTable from "../../OrderTable/OrderTable";
import FilterDropDownList from "../../../../filterDropDownList/FilterDropDownList";
import { deleteOrders } from "../../../../../API/ordersAPI";
import SearchableContent from "../../../../searchableContent/SearchableContent";
import DropDownList from "../../../../dropDownList/DropDownList";
import InputMask from "react-input-mask";
import { createOrder } from "../../../../../API/ordersAPI";
import OrderData from "../neworder/orderDetails/OrderData";
import AuthStore from "../../../../../AuthStore";
import NotificationManager from "../../../../notificationManager/NotificationManager";
import NotificationStore from "../../../../../NotificationStore";
import { observer } from 'mobx-react-lite';

const Orders = observer(() => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);
  const { isAuth, isLoadingAuth } = AuthStore;

  const [selectedColumns, setSelectedColumns] = useState([
    "№",
    "дата",
    "покупатель",
    "статус",
    "сообщения",
    "тег",
    "сумма",
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

  const [statusObj, setStatusObj] = useState({});
  const [tagObj, setTagObj] = useState({});

  const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
  const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);
  const [selectedFilterItems, setSelectedFilterItems] = useState({});

  const [isClearFDDlistSelectedItems, setIsClearFDDlistSelectedItems] =
    useState(false);

  const [editableFields, setEditableFields] = useState({});

  const [isNewOrder, setIsNewOrder] = useState(false);

  const inputPokupatelRef = useRef(null);

  const inputDateOrderRef = useRef(null);

  const warehouseTableBtnContainerRef = useRef(null);

  const searchableContentRef = useRef(null);

  const newOrderRef = useRef(null);

  const columns = [
    "№",
    "дата",
    "покупатель",
    "статус",
    "сообщения",
    "тег",
    "сумма",
    "канал продаж",
    "адрес доставки",
    "доставка",
    "заметки",
    "комментарий",
    "телефон",
    "почта",
  ];

  const { errorText, successText, setErrorText, setSuccessText, resetErrorText, resetSuccessText } = NotificationStore;

  const handleCheckboxCount = (checkboxCount, idsCount) => {
    setActiveCheckboxCount(checkboxCount);
    setActiveCheckboxIds(idsCount);
  };

  // useEffect(() => {
  //     console.log(isAuth);
  // }, [isAuth]);

  const handleIdList = (ids) => {
    setIdList(ids);
  };

  const handleStatusList = (status) => {
    setStatusList(status);
  };

  const handleTagList = (tag) => {
    setTagList(tag);
  };

  const handleFetchData = () => {
    setIsFetchData(false);
  };

  const showFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const showSearchableContent = () => {
    searchableContentRef.current.style.display = "flex";
  };

  const closeSearchableContent = () => {
    searchableContentRef.current.style.display = "none";
  };

  const handleFilterSelection = () => {
    setSelectedFilterItems({
      id: selectedIds,
      order_date: inputDateOrderRef.current.value,
      status: selectedStatus,
      full_name: inputPokupatelRef.current.value,
      tag: selectedTag,
    });
  };

  const handleOutsideClick = (event) => {
    if (filterBtnRef.current && filterBtnRef.current.contains(event.target)) {
      return;
    }

    if (
      filterRef.current &&
      !filterRef.current.contains(event.target) &&
      event.target !== columnsListRef.current
    ) {
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


    if (
        newOrderRef.current &&
        !newOrderRef.current.contains(event.target)
      ) {
        setIsNewOrder(false);
      }
  };

  useEffect(() => {
    if (isFilterOpen || showColumnList || isNewOrder) {
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
  }, [isFilterOpen, showColumnList, isNewOrder]);

  useEffect(() => {
    if (activeCheckboxCount > 0) {
      warehouseTableBtnContainerRef.current.style.display = "flex";
    } else {
      warehouseTableBtnContainerRef.current.style.display = "none";
    }
  }, [activeCheckboxCount]);

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

  const handleSelectedIids = (items) => {
    setSelectedIds(items);
  };

  const handleSelectedStatus = (items) => {
    setSelectedStatus(items);
  };

  const handleSelectedTag = (items) => {
    setSelectedTag(items);
  };

  const handleStatusObj = (obj) => {
    setStatusObj(obj);
  };

  const handleTagObj = (obj) => {
    setTagObj(obj);
  };

  // useEffect(() => {
  //     console.log(statusObj);
  //     console.log(tagObj);
  // }, [statusObj, tagObj]);
  const clearSelectedItems = () => {
    setSelectedIds([]);
    setSelectedStatus([]);
    setSelectedTag([]);
    setIsClearFDDlistSelectedItems(true);
    inputPokupatelRef.current.value = '';
    inputDateOrderRef.current.value = '';
  };

  const isClearDone = () => {
    setIsClearFDDlistSelectedItems(false);
  };

  useEffect(() => {
    const selectedItems = document.querySelectorAll(".id-list__item-selected");
    selectedItems.forEach((item) =>
      item.classList.remove("id-list__item-selected-last")
    );
    if (selectedItems.length > 0) {
      selectedItems[selectedItems.length - 1].classList.add(
        "id-list__item-selected-last"
      );
    }
  }, [selectedIds]);

  async function deleteSelectedOrders(idArr) {
    try {
      const response = await deleteOrders(idArr);
      console.log(response)
      setSuccessText("Успех!")
    } catch (e) {
      console.log(e);
      setErrorText(e.response.data.detail)
    }
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const contentRef = useRef(null);

//   useEffect(() => {
//     if (searchTerm) {
//       searchAndHighlight(searchTerm);
//     } else {
//       clearHighlights();
//     }
//     console.log(searchTerm);
//   }, [searchTerm]);

  const searchAndHighlight = (term) => {
    const content = contentRef.current;
    if (!content) return;

    const searchTermRegEx = new RegExp(term, "ig");
    const matches = content.innerText.match(searchTermRegEx);

    if (matches && matches.length > 0) {
      clearHighlights();

      let highlightedText = content.innerHTML;
      highlightedText = highlightedText.replace(searchTermRegEx, `<span class='match'>$&</span>`);
      content.innerHTML = highlightedText;

      setHighlightedIndex(0);
      scrollToHighlighted(0);
    }
  };

  const clearHighlights = () => {
    const content = contentRef.current;
    if (!content) return;

    const matches = content.querySelectorAll('.match');
    matches.forEach(match => {
      const parent = match.parentNode;
      parent.replaceChild(document.createTextNode(match.innerText), match);
    });
  };

  const scrollToHighlighted = (index) => {
    const matches = contentRef.current.querySelectorAll('.match');
    if (matches.length > 0) {
      const highlighted = matches[index];
      highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlighted.classList.add('highlighted');
    }
  };

  const handleSearch = () => {
    searchAndHighlight(searchTerm);
  };
  
  const handleNext = () => {
    const matches = contentRef.current.querySelectorAll('.match');
    if (matches.length === 0) return;
  
    let nextIndex = highlightedIndex + 1;
    if (nextIndex >= matches.length) {
      nextIndex = 0;
    }
  
    matches[highlightedIndex].classList.remove('highlighted');
    setHighlightedIndex(nextIndex);
    scrollToHighlighted(nextIndex);
  };
  
  const handlePrevious = () => {
    const matches = contentRef.current.querySelectorAll('.match');
    if (matches.length === 0) return;
  
    let prevIndex = highlightedIndex - 1;
    if (prevIndex < 0) {
      prevIndex = matches.length - 1;
    }
  
    matches[highlightedIndex].classList.remove('highlighted');
    setHighlightedIndex(prevIndex);
    scrollToHighlighted(prevIndex);
  };

  const handleChange = (e, field) => {
    const value = e.target.value;

    setEditableFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div id="orders" ref={contentRef}>
      <div className="warehouse-page__header">
        <div className="warehouse-page__header-container">
          <div className="warehouse-page__btn-container">
            {/* <PopularButton text={'Фильтр'} isHover={true} onClick={openFilter} /> */}
            <button
              className="warehouse-page__btn-filter"
              onClick={showFilter}
              ref={filterBtnRef}
            >
              Фильтр
            </button>
            <PopularButton
              text={"+ Заказ"}
              isHover={true}
              onClick={() => setIsNewOrder((isNewOrder) => !isNewOrder)}
            />
            {isNewOrder && (
              <OrderData
                configName="newOrderConfig"
                showNewOrder={setIsNewOrder}
              />
            )}
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
              {activeCheckboxCount}
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
            {/* <div className="warehouse-table__settings-img">
              <img
                className="warehouse-table__settings-image"
                src={settings}
                alt="settings"
              />
            </div>
            <div className="warehouse-table__settings-img--hover">
              <img
                className="warehouse-table__settings-image--hover"
                src={settingsHover}
                alt="settings"
              />
            </div> */}
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
                <PopularButton
                  text={"Очистить всё"}
                  isHover={true}
                  onClick={() => clearSelectedItems()}
                />
                <PopularButton
                  text={"Применить"}
                  isHover={true}
                  onClick={() => {
                    handleFilterSelection();
                    clearSelectedItems();
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
      <OrderTable
        selectedColumns={selectedColumns}
        childValue={[
          handleCheckboxCount,
          handleIdList,
          handleStatusList,
          handleFetchData,
          handleTagList,
        ]}
        selectedFilterItems={selectedFilterItems}
        isFetchData={isFetchData}
        // ref={contentRef}
      />
      {errorText && <NotificationManager errorMessage={errorText} resetFunc={resetErrorText} />}
      {successText && <NotificationManager successMessage={successText} resetFunc={resetSuccessText} />}
    </div>
  );
});

export default Orders;
