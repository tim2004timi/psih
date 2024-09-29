import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Products.css";
import PopularButton from "../../../../popularButton/PopularButton";
import search from "../../../../../assets/img/search_btn.svg";
import HeaderButton from "../../../../headerApp/headerButton/HeaderButton";
import settings from "../../../../../assets/img/table-settings.svg";
import plus from "../../../../../assets/img/plus_zakaz.svg";
import close from "../../../../../assets/img/close_filter.png";
import { Link } from "react-router-dom";
import FilterDropDownList from "../../../../filterDropDownList/FilterDropDownList";
import szhatie from "../../../../../assets/img/szhatie-strok.png";
import editor from "../../../../../assets/img/editor-btn.png";
import deleteTable from "../../../../../assets/img/delete-table.png";
import archiveBtn from "../../../../../assets/img/toArchive-btn.png";
import archiveBtnHover from "../../../../../assets/img/fromArchive-btn.png";
import categoreisClose from "../../../../../assets/img/categories_closebtn.svg";
import {
  getCategories,
  getProductsNA,
  patchProduct,
  deleteCategory,
  createCategory,
} from "../../../../../API/productsApi";
import { useDispatch, useSelector } from "react-redux";
import { setProductsNA } from "../../../../stm/productsNASlice";

const Products = () => {
  const dispatch = useDispatch();
  const productsNA = useSelector((state) => state.productsNA.productsNA);

  const [checkboxStates, setCheckboxStates] = useState({});
  const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
  const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);

  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);

  const [selectedColumns, setSelectedColumns] = useState([
    "название",
    "артикул",
    "цена",
    "остаток",
    "в архив",
  ]);
  const [showColumnList, setShowColumnList] = useState(false);
  const columnsListRef = useRef(null);
  const columnsListBtnRef = useRef(null);
  const columns = ["название", "артикул", "цена", "остаток", "в архив"];

  const [isNewProduct, setIsNewProduct] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesObj, setCategoriesObj] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [isCategoriesSettingsOpen, setIsCategoriesSettingsOpen] =
    useState(false);

  const categoriesSettingsInputRef = useRef(null);
  const categoriesSettingsRef = useRef(null);

  const warehouseTableBtnContainerRef = useRef(null);

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

  const handleCheckboxChange = (rowId, event) => {
    // console.log('handleCheckboxChange')
    event.stopPropagation();
    setLastSelectedIndex(rowId);

    let countChange = 0;

    setCheckboxStates((prevState) => {
      // console.log('setCheckboxStates')
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
    setActiveCheckboxCount(Math.floor(activeCheckboxCount))
    setActiveCheckboxIds(activeCheckboxIds.filter((item, index) => activeCheckboxIds.indexOf(item) === index))
  }, [activeCheckboxCount]);

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

    if (
      categoriesSettingsRef.current &&
      categoriesSettingsRef.current.contains(event.target)
    ) {
      return;
    }

    if (
      categoriesSettingsRef.current &&
      !categoriesSettingsRef.current.contains(event.target) &&
      event.target !== categoriesSettingsRef.current
    ) {
      setIsCategoriesSettingsOpen(false);
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

  useEffect(() => {
        
    if (activeCheckboxCount > 0) {
        warehouseTableBtnContainerRef.current.style.display = 'flex';
    } else {
        warehouseTableBtnContainerRef.current.style.display = 'none';
    }

  }, [activeCheckboxCount])

  async function fetchCategories() {
    try {
      const response = await getCategories();
      const newCategoriesObj = response.data.reduce((acc, category) => {
        acc[category.name] = category.id;
        return acc;
      }, {});
      setCategoriesObj(newCategoriesObj);
      const newCategories = Object.keys(newCategoriesObj);
      setCategories((prevCategories) => [
        ...new Set([...prevCategories, ...newCategories]),
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchProductsNA() {
    try {
      const response = await getProductsNA();
      dispatch(setProductsNA(response.data));
    } catch (e) {
      console.error(e);
    }
  }

  const filterProductsByCategories = (category) => {
    const newProducts = productsNA.filter(
      (product) => product.category.name === category
    );
    setFilteredProducts(newProducts);
  };

  useEffect(() => {
    fetchCategories();
    fetchProductsNA();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      filterProductsByCategories(categories[0]);
      setSelectedCategory(categories[0]);
    }
  }, [categories, productsNA]);

  async function toArchive(id, key, newValue) {
    try {
      let response = await patchProduct(id, key, newValue);
      console.log(response.data);
      fetchProductsNA();
    } catch (e) {
      console.error(e);
    }
  }

  const deleteCategoryById = useCallback(
    async (categoryId) => {
      try {
        const response = await deleteCategory(categoryId);
        setCategories((prevCategories) =>
          prevCategories.filter(
            (category) => categoriesObj[category] !== categoryId
          )
        );
        setCategoriesObj((prevCategoriesObj) => {
          const newCategoriesObj = { ...prevCategoriesObj };
          delete newCategoriesObj[
            Object.keys(newCategoriesObj).find(
              (key) => newCategoriesObj[key] === categoryId
            )
          ];
          return newCategoriesObj;
        });
        categoriesSettingsInputRef.current.value = "";
      } catch (e) {
        console.error(e);
      }
    },
    [categoriesObj]
  );

  const createCategoryName = async (name) => {
    if (!name) return;
    try {
      const response = await createCategory(name);
      setCategories((prevCategories) => [...prevCategories, name]);
      setCategoriesObj((prevCategoriesObj) => ({
        ...prevCategoriesObj,
        [name]: response.data.id,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const columnConfig = {
    название: {
      className: "products-column column-name",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.name ? (
          <div
            className={`products-column-container column-name__container ${
              isChecked ? "product-colums-selected" : ""
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
                  handleCheckboxChange(row.id, event);
                  event.preventDefault();
                }}
              ></span>
            </div>
            <div className="column-number__content">
              <Link to={`/products/${row.id}`}>{row.name}</Link>
              <div className={`column-name__container-img`}>
                <img className="column-name__img" src={row.img} alt="img" />
              </div>
            </div>
          </div>
        ) : null;
      },
    },
    артикул: {
      className: "products-column column-article",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.article ? (
          <div
            className={`products-column-container column-article__container ${
              isChecked ? "product-colums-selected" : ""
            }`}
          >
            {row.article}
          </div>
        ) : null;
      },
    },
    цена: {
      className: "products-column column-price",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return (
          <div
            className={`products-column-container column-price__container ${
              isChecked ? "product-colums-selected" : ""
            }`}
          >
            {row.price + " ₽"}
          </div>
        );
      },
    },
    остаток: {
      className: "products-column column-product-remains",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return (
          <div
            className={`products-column-container column-remains__container ${
              isChecked ? "product-colums-selected" : ""
            }`}
          >
            {row.remaining + " " + row.measure}
          </div>
        );
      },
    },
    "в архив": {
      className: "products-column column-archive",
      content: (row) => {
        return !row.archived ? (
          <div
            className={`products-column-container column-archive__container`}
          >
            <button
              className="column-archive__btn"
              onClick={() => toArchive(row.id, "archived", true)}
            >
              <img
                src={archiveBtn}
                alt="archive-btn"
                className="column-archive__img"
              />
              <img
                src={archiveBtnHover}
                alt="archive-btn"
                className="column-archive__img--hover"
              />
            </button>
          </div>
        ) : null;
      },
    },
  };

  const renderCategoriesBtn = () => {
    return categories.map((category, index) => (
      <button
        key={index}
        className={`productTable__nav-btn  ${
          selectedCategory === category ? "productTable__nav-btn--selected" : ""
        }`}
        onClick={() => {
          filterProductsByCategories(category);
          setSelectedCategory(category);
        }}
      >
        {category}
      </button>
    ));
  };

  const renderCategoriesSettingsBtn = () => {
    return categories.map((category, index) => (
      <div className="categories-settings__btn-item" key={index}>
        {category}
        <button
          className="categories-settings__btn-btn"
          onClick={() => {
            deleteCategoryById(categoriesObj[category]);
          }}
        >
          <img
            src={categoreisClose}
            alt="delete-btn"
            className="categories-settings__btn-img"
          />
        </button>
      </div>
    ));
  };

  const renderHeaders = () => {
    return selectedColumns.map((column, index) => (
      <th key={index} className="products-column-header">
        {column}
      </th>
    ));
  };

  const renderRows = () => {
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
            <PopularButton text={"+ Товар"} isHover={true} />
            {isNewProduct && 
              <div className="new-product">
                <div className="new-product__img">
                  <div className="new-product__save-btn">
                    <PopularButton text={"Сохранить"} isHover={true} />
                  </div>
                  <form className="new-product__form" method="post">
                    <div className="new-product__upload-zone">
                      <p className="new-product__upload-zone-plus">+</p>
                    </div>
                    <div className="new-product__form-load-btn">
                      <input type="file" className="new-product__form-load-input" />
                    </div>
                  </form>
                </div>
                
              </div>
            }
            <div className="products-header-vert-separator"></div>
            <Link>
              <PopularButton text={"Архив"} isHover={true} />
            </Link>
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
            <button className="warehouse-table-btn  warehouse-table-btn__editor">
              <img className="orderTable-btn__img" src={editor} alt="editor" />
            </button>
            <button
              className="warehouse-table-btn  warehouse-table-btn__delete-table"
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
                  <p className="filter__text">Номер заказа</p>
                  <FilterDropDownList
                    
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Номер заказа</p>
                  <FilterDropDownList
                    
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Номер заказа</p>
                  <FilterDropDownList
                    
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Статус</p>
                  <FilterDropDownList
                   
                  />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Тег</p>
                  <FilterDropDownList
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
      <div className="productTable">
        <div className="productTable__nav">
          <p className="productTable__nav-header">категории</p>
          <div className="productTable__nav-container">
            {renderCategoriesBtn()}
            <div className="productTable__nav-add">
              <span
                className="productTable__nav-addBtn"
                onClick={() =>
                  setIsCategoriesSettingsOpen(!isCategoriesSettingsOpen)
                }
              ></span>
            </div>
            {isCategoriesSettingsOpen && (
              <div className="categories-settings" ref={categoriesSettingsRef}>
                <div className="categories-settings-content">
                  <div className="categories-settings__close">
                    <button
                      className="categories-settings__close-btn"
                      onClick={() => setIsCategoriesSettingsOpen(false)}
                    >
                      <img
                        src={categoreisClose}
                        alt="close"
                        className="categories-settings__close-img"
                      />
                    </button>
                  </div>
                  <div className="categories-settings__input">
                    <p className="categories-settings__input-text">
                      Добавить категорию
                    </p>
                    <input
                      type="text"
                      className="categories-settings__input-input"
                      ref={categoriesSettingsInputRef}
                    />
                  </div>
                  <div className="categories-settings__btn">
                    {renderCategoriesSettingsBtn()}
                  </div>
                  <div className="categories-settings-add">
                    <button
                      className="categories-settings-add__btn"
                      onClick={() => {
                        createCategoryName(
                          categoriesSettingsInputRef.current.value
                        );
                      }}
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="productTable__table-wrapper">
          <table className="productTable__table">
            <thead>
              <tr>{renderHeaders()}</tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Products;
