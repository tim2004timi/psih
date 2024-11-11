import React, { useState, useRef, useEffect } from "react";
import PopularButton from "../../../../popularButton/PopularButton";
import deleteTable from "../../../../../assets/img/delete-table.png";
import search from "../../../../../assets/img/search_btn.svg";
import FilterDropDownList from "../../../../filterDropDownList/FilterDropDownList";
import NotificationManager from "../../../../notificationManager/NotificationManager";
import NotificationStore from "../../../../../NotificationStore";
import { observer } from "mobx-react-lite";
import PartyStore from "../../../../../PartyStore";
import { Tooltip } from "react-tooltip";
import { formatDateTime } from "../../../../../API/formateDateTime";
import './Parties.css'
import SupplyTable from '../../../../supplyTable/SupplyTable';
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import NewFilterDropDown from "../../../../newFilterDropDown/NewFilterDropDown.jsx";
import {toJS} from "mobx";

const Parties = observer(() => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);

  const [checkboxStates, setCheckboxStates] = useState({});
  const [showStatusList, setShowStatusList] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

  const [isFilterProducts, setIsFilterProducts] = useState(false)

  let initialCheckboxStates;
  const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
  const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);

  const [editableFields, setEditableFields] = useState({});

  const [isNewSupply, setIsNewSupply] = useState(false);
  const [isPageSupply, setIsPageSupply] = useState(false);

  const inputNameRef = useRef(null);

  const [uniqueFilterItems, setUniqueFilterItems] = useState({});
  const [selectedParties, setSelectedParties] = useState({});
  const [isFilterParties, setIsFilterParties] = useState(false)

  const warehouseTableBtnContainerRef = useRef(null);

  const searchableContentRef = useRef(null);

  const newOrderRef = useRef(null);

  const columnsListBtnRef = useRef(null);

  const { parties, getParties, deleteParties } = PartyStore;

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
  const columns = ["№", "дата", "поставщик", "статус", "тег", "сумма"];

  const {
    errorText,
    successText,
    setErrorText,
    setSuccessText,
    resetErrorText,
    resetSuccessText,
  } = NotificationStore;

  const columnConfig = {
    "№": {
      className: "column-class column-number",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return (
          row.id != null && (
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
                <Link
                  className="column-number-link-link"
                  to={`${row.id}`}
                >
                  {row.id}
                </Link>
              </div>
            </div>
          )
        );
      },
    },

    дата: {
      className: "column-class column-date",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        const date = formatDateTime(row.party_date);
        return (
          row.party_date != null && (
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

    поставщик: {
      className: "column-class column-full_name",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.agent_name != null ? (
          <div
            className={`column-full_name__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
            data-tooltip-id="full_name-tooltip"
            data-tooltip-content={row.agent_name}
          >
            {row.agent_name}
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
          row.tag !== '' && (
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
        return (
          row.summ != null && (
            <div
              className={`column-summ__container ${
                isChecked ? "highlighted-cell" : ""
              }`}
            >
              {row.summ + " ₽"}
            </div>
          )
        );
      },
    }
  };

  const handleCheckboxChange = (rowId, event) => {
    // console.log('handleCheckboxChange')
    event.stopPropagation();
    setLastSelectedIndex(rowId);

    let countChange = 0;

    setCheckboxStates((prevState) => {
      window.getSelection().removeAllRanges();
      let upFlag;
      const newState = { ...prevState };
      // console.log(newState);

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
              setActiveCheckboxIds((prevState) => [...prevState, i]);
            }
          }
        } else {
          for (let i = start; i < end; i++) {
            if (newState[i] !== undefined) {
              newState[i] = !newState[i];
              countChange += newState[i] ? 1 : -1;
              setActiveCheckboxIds((prevState) => [...prevState, i]);
            }
          }
        }
      } else {
        // console.log('here');
        const wasChecked = newState[rowId] || false;
        newState[rowId] = !wasChecked;
        countChange += newState[rowId] ? 1 : -1;
        setActiveCheckboxIds((prevState) => [...prevState, rowId]);
      }

      return newState;
    });

    setActiveCheckboxCount((prevCount) => prevCount + countChange);
  };

  useEffect(() => {
    handleCheckboxCount(
      Math.floor(activeCheckboxCount),
      activeCheckboxIds.filter(
        (item, index) => activeCheckboxIds.indexOf(item) === index
      )
    );
    // console.log(activeCheckboxIds.filter((item, index) => activeCheckboxIds.indexOf(item) === index))
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

  const handleCheckboxCount = (checkboxCount, idsCount) => {
    setActiveCheckboxCount(checkboxCount);
    setActiveCheckboxIds(idsCount);
  };

  // useEffect(() => {
  //   console.log(selectedParties);
  // }, [selectedParties]);

  const handleSelect = (field, item) => {
    setSelectedParties((prevSelectedParties) => {
      const fieldItems = prevSelectedParties[field] || [];
      const isSelected = fieldItems.includes(item);

      if (isSelected) {
        // Если элемент уже выбран, удаляем его
        return {
          ...prevSelectedParties,
          [field]: fieldItems.filter((selectedItem) => selectedItem !== item),
        };
      } else {
        // Если элемент не выбран, добавляем его
        return {
          ...prevSelectedParties,
          [field]: [...fieldItems, item],
        };
      }
    });

    // Обновляем uniqueFilterItems
    setUniqueFilterItems((prevUniqueFilterItems) => {
      const fieldItems = prevUniqueFilterItems[field] || [];
      const isSelected = fieldItems.includes(item);

      if (isSelected) {
        // Если элемент уже выбран, удаляем его
        return {
          ...prevUniqueFilterItems,
          [field]: fieldItems.filter((uniqueItem) => uniqueItem !== item),
        };
      } else {
        // Если элемент не выбран, добавляем его
        return {
          ...prevUniqueFilterItems,
          [field]: [...fieldItems, item],
        };
      }
    });
  };

  const renderStatusList = (row) => {
    return (
      <div className="column-status__list-container">
        <div className="column-status__list">
          <button
            className="column-status__in-process"
            // onClick={() => updateOrderStatus(row.id, "на складе")}
          >
            на складе
          </button>
          <button
            className="column-status__refund"
            // onClick={() => updateOrderStatus(row.id, "не заказано")}
          >
            не заказано
          </button>
          <button
            className="column-status__delivered"
            // onClick={() => updateOrderStatus(row.id, "оплачено")}
          >
            оплачено
          </button>
        </div>
      </div>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "на складе":
        return "column-status__in-process";
      case "не заказано":
        return "column-status__refund";
      case "оплачено":
        return "column-status__delivered";
    }
  };

  const showFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilter = () => {
    setIsFilterProducts(false)
    setSelectedParties({})
    inputNameRef.current.value = ''
    const uniqueFilterItems = {
      agent_name: Array.from(
        new Set(parties.map((party) => party.agent_name))
      ),
      status: Array.from(new Set(parties.map((party) => party.status))),
      party_date: Array.from(new Set(parties.map((party) => formatDateTime(party.party_date)))),
      id: Array.from(new Set(parties.map((party) => party.id))),
      tag: Array.from(new Set(parties.map((party) => party.tag))),
    };

    setUniqueFilterItems(uniqueFilterItems);
  };

  useEffect(() => {
    getParties();
    //   console.log(parties);
  }, []);

  useEffect(() => {
    initialCheckboxStates = parties.reduce((acc, row) => {
      acc[row.id] = false;
      return acc;
    }, {});
    setCheckboxStates(initialCheckboxStates);
    const uniqueFilterItems = {
      agent_name: Array.from(
        new Set(parties.map((party) => party.agent_name))
      ),
      status: Array.from(new Set(parties.map((party) => party.status))),
      party_date: Array.from(new Set(parties.map((party) => formatDateTime(party.party_date)))),
      id: Array.from(new Set(parties.map((party) => party.id))),
      tag: Array.from(new Set(parties.map((party) => party.tag))),
    };

    setUniqueFilterItems(uniqueFilterItems);
  }, [parties])

  // const handleSetUniqueFilterItems = (field) => {
  //   setUniqueFilterItems((prevState) => ({
  //     ...prevState,
  //     [field]: Array.from(new Set(parties.map((party) => party[field]))),
  //   }))
  // }
  
  useEffect(() => {

    if (activeCheckboxCount > 0) {
      warehouseTableBtnContainerRef.current.style.display = "flex";
    } else {
      warehouseTableBtnContainerRef.current.style.display = "none";
    }
  
    setActiveCheckboxCount(Math.floor(activeCheckboxCount));
    setActiveCheckboxIds(
      activeCheckboxIds.filter(
        (item, index) => activeCheckboxIds.indexOf(item) === index
      )
    );
  }, [activeCheckboxCount]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await patchOrder(orderId, "status", newStatus);
      setProducts((prevData) =>
        prevData.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setShowStatusList((prev) => ({ ...prev, [orderId]: false }));

      // setUniqueStatuses((prevStatuses) => {
      //   const newStatuses = new Set(prevStatuses);
      //   newStatuses.add(newStatus);
      //   handleStatusList(Array.from(newStatuses));
      //   return newStatuses;
      // });
      setSuccessText('Статус успешно обновлен!')
    } catch (error) {
      console.error("Error updating order status:", error);
      setErrorText(error.response.data.detail)
    }
  };

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
    const filteredProducts = isFilterProducts
      ? parties.filter((row) => {
          if (
            Object.keys(selectedParties).length === 0 &&
            inputNameRef.current?.value === ""
          ) {
            return true;
          }

          const idMatches =
            !("id" in selectedParties) || selectedParties.id?.includes(row.id);
          const nameMatches =
            inputNameRef.current?.value === "" ||
            row.agent_name?.includes(inputNameRef?.current?.value);
          const party_dateMatches =
            !("party_date" in selectedParties) ||
            selectedParties.party_date?.includes(formatDateTime(row.party_date));
          const statusMatches =
            !("status" in selectedParties) ||
            selectedParties.status?.includes(row.status);
          const tagMatches =
            !("tag" in selectedParties) ||
            selectedParties.tag?.includes(row.tag);
          const priceMatches =
            !("price" in selectedParties) ||
            selectedParties.price?.includes(row.price);

          return (
            idMatches &&
            nameMatches &&
            party_dateMatches &&
            statusMatches &&
            tagMatches &&
            priceMatches
          );
        })
      : parties;

    return filteredProducts.map((row, rowIndex) => (
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
                onClick={showFilter}
                ref={filterBtnRef}
            >
              Фильтр
            </button>
            <PopularButton
              text={"+ Поставка"}
              isHover={true}
                onClick={() => setIsNewSupply((isNewSupply) => !isNewSupply)}
            />
            {isNewSupply && (
              <SupplyTable showPage={setIsNewSupply}/>
            )}
          </div>
          <div
            className="warehouse-table-btn__container"
            ref={warehouseTableBtnContainerRef}
          >
            <div className="warehouse-table-btn__counter">
              {activeCheckboxCount}
            </div>
            <button
              className="warehouse-table-btn warehouse-table-btn__delete-table"
              onClick={() => {
                deleteParties(activeCheckboxIds);
                getParties();
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
          ></button>
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
              <div className="filter__container">
                <div className="filter__item">
                  <p className="filter__text">Номер заказа</p>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="dropdown-trigger">
                        <div className="dropdown-trigger__content">
                          {selectedParties.id?.length > 0
                            ? selectedParties.id
                                .map((field) => field)
                                .join(", ")
                            : ""}
                        </div>
                        <div className="filterdropdownlist__content-btn">
                          <span
                            className={`filterdropdownlist__arrow 
                              \${
                                // isOpen ? "filterdropdownlist__arrow-active" : ""
                              // }`}
                          >
                            <span className="filterdropdownlist__arrow-btn"></span>
                            <span className="filterdropdownlist__arrow-btn"></span>
                          </span>
                        </div>
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="dropdown-content"
                      >
                        {selectedParties.id?.map((item, index) => (
                          <DropdownMenu.Item
                            key={index}
                            className="dropdown-item dropdown-item--selected"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleSelect("id", item);
                            }}
                          >
                            {item}
                          </DropdownMenu.Item>
                        ))}
                        {selectedParties.id?.length > 0 && (
                          <div className="dropdown-separator"></div>
                        )}
                        {Array.from(uniqueFilterItems.id).map(
                          (item, index) => (
                            <DropdownMenu.Item
                              key={index}
                              className="dropdown-item"
                              onSelect={(event) => {
                                event.preventDefault();
                                handleSelect("id", item);
                              }}
                            >
                              {item}
                            </DropdownMenu.Item>
                          )
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
                <div className="filter__item">
                  <p className="filter__text">Дата</p>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="dropdown-trigger">
                        <div className="dropdown-trigger__content">
                          {selectedParties.party_date?.length > 0
                            ? selectedParties.party_date
                                .map((field) => field)
                                .join(", ")
                            : ""}
                        </div>
                        <div className="filterdropdownlist__content-btn">
                          <span
                            className={`filterdropdownlist__arrow 
                              \${
                                // isOpen ? "filterdropdownlist__arrow-active" : ""
                              // }`}
                          >
                            <span className="filterdropdownlist__arrow-btn"></span>
                            <span className="filterdropdownlist__arrow-btn"></span>
                          </span>
                        </div>
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="dropdown-content"
                      >
                        {selectedParties.party_date?.map((item, index) => (
                          <DropdownMenu.Item
                            key={index}
                            className="dropdown-item dropdown-item--selected"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleSelect("party_date", item);
                            }}
                          >
                            {item}
                          </DropdownMenu.Item>
                        ))}
                        {selectedParties.party_date?.length > 0 && (
                          <div className="dropdown-separator"></div>
                        )}
                        {Array.from(uniqueFilterItems.party_date).map(
                          (item, index) => (
                            <DropdownMenu.Item
                              key={index}
                              className="dropdown-item"
                              onSelect={(event) => {
                                event.preventDefault();
                                handleSelect("party_date", item);
                              }}
                            >
                              {item}
                            </DropdownMenu.Item>
                          )
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
                <div className="filter__item">
                  <p className="filter__text">Поставщик</p>
                  <input
                    className="filter__input filter__input--pokupatel"
                    type="text"
                    ref={inputNameRef}
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Статус</p>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="dropdown-trigger">
                        <div className="dropdown-trigger__content">
                          {selectedParties.status?.length > 0
                            ? selectedParties.status
                                .map((field) => field)
                                .join(", ")
                            : ""}
                        </div>
                        <div className="filterdropdownlist__content-btn">
                          <span
                            className={`filterdropdownlist__arrow 
                              \${
                                // isOpen ? "filterdropdownlist__arrow-active" : ""
                              // }`}
                          >
                            <span className="filterdropdownlist__arrow-btn"></span>
                            <span className="filterdropdownlist__arrow-btn"></span>
                          </span>
                        </div>
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="dropdown-content"
                      >
                        {selectedParties.status?.map((item, index) => (
                          <DropdownMenu.Item
                            key={index}
                            className="dropdown-item dropdown-item--selected"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleSelect("status", item);
                            }}
                          >
                            {item}
                          </DropdownMenu.Item>
                        ))}
                        {selectedParties.status?.length > 0 && (
                          <div className="dropdown-separator"></div>
                        )}
                        {Array.from(uniqueFilterItems.status).map(
                          (item, index) => (
                            <DropdownMenu.Item
                              key={index}
                              className="dropdown-item"
                              onSelect={(event) => {
                                event.preventDefault();
                                handleSelect("status", item);
                              }}
                            >
                              {item}
                            </DropdownMenu.Item>
                          )
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
                <div className="filter__item">
                  <p className="filter__text">Тег</p>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="dropdown-trigger">
                        <div className="dropdown-trigger__content">
                          {selectedParties.tag?.length > 0
                            ? selectedParties.tag
                                .map((field) => field)
                                .join(", ")
                            : ""}
                        </div>
                        <div className="filterdropdownlist__content-btn">
                          <span
                            className={`filterdropdownlist__arrow 
                              \${
                                // isOpen ? "filterdropdownlist__arrow-active" : ""
                              // }`}
                          >
                            <span className="filterdropdownlist__arrow-btn"></span>
                            <span className="filterdropdownlist__arrow-btn"></span>
                          </span>
                        </div>
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="dropdown-content"
                      >
                        {selectedParties.tag?.map((item, index) => (
                          <DropdownMenu.Item
                            key={index}
                            className="dropdown-item dropdown-item--selected"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleSelect("tag", item);
                            }}
                          >
                            {item}
                          </DropdownMenu.Item>
                        ))}
                        {selectedParties.tag?.length > 0 && (
                          <div className="dropdown-separator"></div>
                        )}
                        {Array.from(uniqueFilterItems.tag).map(
                          (item, index) => (
                            <DropdownMenu.Item
                              key={index}
                              className="dropdown-item"
                              onSelect={(event) => {
                                event.preventDefault();
                                handleSelect("tag", item);
                              }}
                            >
                              {item}
                            </DropdownMenu.Item>
                          )
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>
              <div className="filter-btn-container">
                <PopularButton
                  text={"Очистить всё"}
                  isHover={true}
                  onClick={() => {
                    handleClearFilter();
                    setIsFilterOpen(false);
                  }}
                />
                <PopularButton
                  text={"Применить"}
                  isHover={true}
                  onClick={() => {
                    setIsFilterProducts(true);
                    setIsFilterOpen(false);
                    // handleClearFilter();
                  }}
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
      {errorText && (
        <NotificationManager
          errorMessage={errorText}
          resetFunc={resetErrorText}
        />
      )}
      {successText && (
        <NotificationManager
          successMessage={successText}
          resetFunc={resetSuccessText}
        />
      )}
    </>
  );
});

export default Parties;
