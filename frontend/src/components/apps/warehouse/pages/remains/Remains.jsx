import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import PopularButton from "../../../../popularButton/PopularButton";
import szhatie from "../../../../../assets/img/szhatie-strok.png";
import editor from "../../../../../assets/img/editor-btn.png";
import deleteTable from "../../../../../assets/img/delete-table.png";
import settings from "../../../../../assets/img/table-settings.svg";
import search from "../../../../../assets/img/search_btn.svg";
import "./Remains.css";
import FilterDropDownList from "../../../../filterDropDownList/FilterDropDownList";
import { getProducts, deleteProducts } from "../../../../../API/productsApi";
import NotificationManager from "../../../../notificationManager/NotificationManager";
import NotificationStore from "../../../../../NotificationStore";
import { observer } from "mobx-react-lite";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const Remains = observer(() => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [isFilterProducts, setIsFilterProducts] = useState(false)

  const [uniqueFilterItems, setUniqueFilterItems] = useState({});

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdowndRef = useRef(null);

  let initialCheckboxStates;

  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

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

  const [checkboxStates, setCheckboxStates] = useState({});
  const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
  const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);
  const [selectedFilterItems, setSelectedFilterItems] = useState({});

  const [isClearFDDlistSelectedItems, setIsClearFDDlistSelectedItems] =
    useState(false);

  const inputNameRef = useRef(null);

  const inputDateOrderRef = useRef(null);

  const warehouseTableBtnContainerRef = useRef(null);

  const columns = [
    "наименование",
    "остаток",
    "предзаказ",
    "себестоимость",
    "сумма продажи",
  ];

  const [isLoading, setIsLoading] = useState(true);

  const {
    errorText,
    successText,
    setErrorText,
    setSuccessText,
    resetErrorText,
    resetSuccessText,
  } = NotificationStore;

  const handleSelect = (field, item) => {
    setSelectedProducts((prevSelectedProducts) => {
      const fieldItems = prevSelectedProducts[field] || [];
      const isSelected = fieldItems.includes(item);

      if (isSelected) {
        // Если элемент уже выбран, удаляем его
        return {
          ...prevSelectedProducts,
          [field]: fieldItems.filter((selectedItem) => selectedItem !== item),
        };
      } else {
        // Если элемент не выбран, добавляем его
        return {
          ...prevSelectedProducts,
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

  const handleClearFilter = () => {
    setIsFilterProducts(false)
    setSelectedProducts({})
    inputNameRef.current.value = ''
    const uniqueFilterItems = {
      cost_price: Array.from(
        new Set(products.map((product) => product.cost_price))
      ),
      price: Array.from(new Set(products.map((product) => product.price))),
      remaining: Array.from(
        new Set(products.map((product) => product.remaining))
      ),
    };

    setUniqueFilterItems(uniqueFilterItems);
  };

  // useEffect(() => {
  //   console.log(selectedProducts);
  // }, [selectedProducts]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const showFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  async function fetchAllProducts() {
    try {
      const response = await getProducts(null);
      let eachProduct = response.data.reduce((acc, row) => {
        row.modifications.forEach((modification) => {
          acc.push({
            id: modification.id,
            id_row: row.id,
            // images: { ...row.images },
            // files: { ...row.files },
            // modifications: { ...row.modifications },
            displayName: `${row.name} (${modification.size})`,
            remaining: modification.remaining,
            cost_price: row.cost_price,
            price: row.price,
          });
        });
        return acc;
      }, []);

      eachProduct.sort((a, b) => a.id - b.id);

      setProducts(eachProduct);

      initialCheckboxStates = response.data.reduce((acc, row) => {
        acc[row.id] = false;
        return acc;
      }, {});
      setCheckboxStates(initialCheckboxStates);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    initialCheckboxStates = products.reduce((acc, row) => {
      acc[row.id] = false;
      return acc;
    }, {});
    setCheckboxStates(initialCheckboxStates);
    const uniqueFilterItems = {
      cost_price: Array.from(
        new Set(products.map((product) => product.cost_price))
      ),
      price: Array.from(new Set(products.map((product) => product.price))),
      remaining: Array.from(
        new Set(products.map((product) => product.remaining))
      ),
    };

    setUniqueFilterItems(uniqueFilterItems);
  }, [products]);

  const handleOutsideClick = (event) => {
    if (filterBtnRef.current && filterBtnRef.current.contains(event.target) || dropdownRef.current && dropdownRef.current.contains(event.target) || dropdowndRef.current && dropdowndRef.current.contains(event.target)) {
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

  const handleCheckboxChange = (rowId, id_row, event) => {
    console.log(id_row)
    event.stopPropagation();
    setLastSelectedIndex(rowId);

    let countChange = 0;

    setCheckboxStates((prevState) => {
      let upFlag;
      const newState = { ...prevState };
      window.getSelection().removeAllRanges();
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
          // console.log(upFlag);
          for (let i = start; i < end; i++) {
            if (newState[i] !== undefined) {
              newState[i] = !newState[i];
              countChange += newState[i] ? 1 : -1;
              setActiveCheckboxIds((prevState) => [...prevState, i]);
            }
          }
        }
      } else {
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
    const handleDocumentClick = (event) => {
      if (
        !event.target.closest(".table") &&
        initialCheckboxStates !== undefined
      ) {
        setCheckboxStates(initialCheckboxStates);
        setActiveCheckboxCount(0);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [initialCheckboxStates]);

  // useEffect(() => {
  //   if (activeCheckboxCount > 0) {
  //     if (warehouseTableBtnContainerRef.current) {
  //       warehouseTableBtnContainerRef.current.style.display = "flex";
  //     }
  //   } else {
  //     if (warehouseTableBtnContainerRef.current) {
  //       warehouseTableBtnContainerRef.current.style.display = "none";
  //     }
  //   }

  //   setActiveCheckboxCount(Math.floor(activeCheckboxCount));
  //   setActiveCheckboxIds(
  //     activeCheckboxIds.filter(
  //       (item, index) => activeCheckboxIds.indexOf(item) === index
  //     )
  //   );
  // }, [activeCheckboxCount]);

  async function deleteSelectedProducts(idArr) {
    try {
      const response = await deleteProducts(idArr);
      setSuccessText("Продукты удалены");
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail);
    }
  }

  // useEffect(() => {
  //   if (isFilterOpen || showColumnList) {
  //     document.addEventListener("mousedown", handleOutsideClick);
  //   } else {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   }

  //   if (isFilterOpen) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, [isFilterOpen, showColumnList]);

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
        const isChecked = checkboxStates[row.id] || false;
        return (
          row.displayName && (
            <div
              className={`remains-column-container column-displayName__container ${
                isChecked ? "remains-colums-selected" : ""
              }`}
            >
              <div className={`column-number-input__container`}>
                <input
                  type="checkbox"
                  className="column-number-input-products"
                  checked={isChecked}
                  readOnly
                />
                <span
                  className="column-number-input__custom-products"
                  onClick={(event) => {
                    handleCheckboxChange(row.id, row.id_row, event);
                    event.preventDefault();
                  }}
                ></span>
              </div>
              <div className="column-number__content">{row.displayName}</div>
            </div>
          )
        );
      },
    },
    остаток: {
      className: "remains-column column-remains",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return (
          <div
            className={`remains-column-container column-remains__container ${
              isChecked ? "remains-colums-selected" : ""
            }`}
          >
            {row.remaining}
          </div>
        );
      },
    },
    предзаказ: {
      className: "remains-column column-preorder",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
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
        const isChecked = checkboxStates[row.id] || false;
        return (
          row.cost_price && (
            <div
              className={`remains-column-container column-cost-price__container ${
                isChecked ? "remains-colums-selected" : ""
              }`}
            >
              {row.cost_price + " ₽"}
            </div>
          )
        );
      },
    },
    "сумма продажи": {
      className: "remains-column column-sum",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return (
          row.price && (
            <div
              className={`remains-column-container column-sum__container ${
                isChecked ? "remains-colums-selected" : ""
              }`}
            >
              {row.price + " ₽"}
            </div>
          )
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

  const renderRows = () => {
    const filteredProducts = isFilterProducts
      ? products.filter((row) => {
          if (
            Object.keys(selectedProducts).length === 0 &&
            inputNameRef.current?.value === ""
          ) {
            return true;
          }

          const remainingMatches =
            !("remaining" in selectedProducts) ||
            selectedProducts.remaining?.includes(row.remaining);
          const nameMatches =
            inputNameRef.current?.value === "" ||
            row.displayName?.includes(inputNameRef?.current?.value);
          const cost_priceMatches =
            !("cost_price" in selectedProducts) ||
            selectedProducts.cost_price?.includes(row.cost_price);
          const priceMatches =
            !("price" in selectedProducts) ||
            selectedProducts.price?.includes(row.price);

          return (
            remainingMatches && nameMatches && cost_priceMatches && priceMatches
          );
        })
      : products;

    return filteredProducts.map((row, rowIndex) => (
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <button
              className="warehouse-table-btn warehouse-table-btn__delete-table"
              onClick={() => {
                console.log(activeCheckboxIds);
                // deleteSelectedProducts(activeCheckboxIds);
                // fetchAllProducts();
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
            {/* <img
              className="warehouse-table__settings-img"
              src={settings}
              alt="settings"
            /> */}
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
              {/* <div className="filter__search">
                <div className="filter__search-container">
                  <div className="filter__search-img-container">
                    <img
                      src={search}
                      alt="search"
                      className="filter__search-img"
                    />
                  </div>
                  <input type="text" className="filter__search-input" placeholder='Поиск по системе' />
                  <input
                    type="text"
                    placeholder="Поиск..."
                    // value={searchTerm}
                    onChange={(e) => highlightText(e.target.value)}
                  />
                  <button onClick={
                        () => {
                            highlightText()
                            setIsFilterOpen(false)
                        }
                    }>Найти</button>
                  <SearchableContent />
                </div>
              </div> */}
              <div className="filter__container">
                <div className="filter__item">
                  <p className="filter__text">Наименование</p>
                  <input
                    className="filter__input filter__input--pokupatel"
                    type="text"
                    ref={inputNameRef}
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Остаток</p>
                  {/* <FilterDropDownList
                    items={products.remaining}
                    onSelect={setProducts}
                   /> */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild ref={dropdowndRef}>
                      <button className="dropdown-trigger">
                        <div className="dropdown-trigger__content">
                          {selectedProducts.remaining?.length > 0
                            ? selectedProducts.remaining
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
                        ref={dropdownRef}
                      >
                        {selectedProducts.remaining?.map((item, index) => (
                          <DropdownMenu.Item
                            key={index}
                            className="dropdown-item dropdown-item--selected"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleSelect("remaining", item);
                            }}
                          >
                            {item}
                          </DropdownMenu.Item>
                        ))}
                        {selectedProducts.remaining?.length > 0 && (
                          <div className="dropdown-separator"></div>
                        )}
                        {Array.from(uniqueFilterItems.remaining).map(
                          (item, index) => (
                            <DropdownMenu.Item
                              key={index}
                              className="dropdown-item"
                              onSelect={(event) => {
                                event.preventDefault();
                                handleSelect("remaining", item);
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
                {/* <div className="filter__item">
                  <p className="filter__text">Предзаказ</p>
                  <FilterDropDownList />
                </div> */}
                <div className="filter__item">
                  <p className="filter__text">Себестоимость</p>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="dropdown-trigger">
                        <div className="dropdown-trigger__content">
                          {selectedProducts.cost_price?.length > 0
                            ? selectedProducts.cost_price
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
                      <DropdownMenu.Content className="dropdown-content">
                        {selectedProducts.cost_price?.map((item, index) => (
                          <DropdownMenu.Item
                            key={index}
                            className="dropdown-item dropdown-item--selected"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleSelect("cost_price", item);
                            }}
                          >
                            {item}
                          </DropdownMenu.Item>
                        ))}
                        {selectedProducts.cost_price?.length > 0 && (
                          <div className="dropdown-separator"></div>
                        )}
                        {Array.from(uniqueFilterItems.cost_price).map(
                          (item, index) => (
                            <DropdownMenu.Item
                              key={index}
                              className="dropdown-item"
                              onSelect={(event) => {
                                event.preventDefault();
                                handleSelect("cost_price", item);
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
                  <p className="filter__text">Сумма продажи</p>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="dropdown-trigger">
                        <div className="dropdown-trigger__content">
                          {selectedProducts.price?.length > 0
                            ? selectedProducts.price
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
                      <DropdownMenu.Content className="dropdown-content">
                        {selectedProducts.price?.map((item, index) => (
                          <DropdownMenu.Item
                            key={index}
                            className="dropdown-item dropdown-item--selected"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleSelect("price", item);
                            }}
                          >
                            {item}
                          </DropdownMenu.Item>
                        ))}
                        {selectedProducts.price?.length > 0 && (
                          <div className="dropdown-separator"></div>
                        )}
                        {Array.from(uniqueFilterItems.price).map(
                          (item, index) => (
                            <DropdownMenu.Item
                              key={index}
                              className="dropdown-item"
                              onSelect={(event) => {
                                event.preventDefault();
                                handleSelect("price", item);
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
                  text="Очистить всё"
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
      <table className="remains-table">
        <thead>
          <tr>{renderHeaders()}</tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
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

export default Remains;
