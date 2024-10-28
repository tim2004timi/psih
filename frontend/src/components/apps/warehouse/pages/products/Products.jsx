import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Products.css";
import "../../../../../../node_modules/react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import PopularButton from "../../../../popularButton/PopularButton";
import search from "../../../../../assets/img/search_btn.svg";
import settings from "../../../../../assets/img/table-settings.svg";
import { Link } from "react-router-dom";
import FilterDropDownList from "../../../../filterDropDownList/FilterDropDownList";
import deleteTable from "../../../../../assets/img/delete-table.png";
import archiveBtn from "../../../../../assets/img/toArchive-btn.png";
import archiveBtnHover from "../../../../../assets/img/fromArchive-btn.png";
import categoreisClose from "../../../../../assets/img/categories_closebtn.svg";
import {
  getCategories,
  patchProduct,
  deleteCategory,
  createCategory,
  deleteProducts,
  getProducts,
} from "../../../../../API/productsApi";
import { serverUrl } from "../../../../../config.js";
import { useDispatch, useSelector } from "react-redux";
import { setProductsNA } from "../../../../stm/productsNASlice";
import getFullImageUrl from "../../../../../API/getFullImgUrl";
import Product from "../product/Product";
import ProductTable from "../../productTable/ProductTable";
import getArticleName from '../../../../../API/getArticleName.js'
import NotificationManager from "../../../../notificationManager/NotificationManager";
import NotificationStore from "../../../../../NotificationStore";
import { observer } from 'mobx-react-lite';

const Products = observer(() => {
  const dispatch = useDispatch();
  const productsNA = useSelector((state) => state.productsNA.productsNA);

  const [checkboxStates, setCheckboxStates] = useState({});
  const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
  const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);
  let initialCheckboxStates;

  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);

  const [selectedColumns, setSelectedColumns] = useState([
    "название",
    "артикул",
    "цена",
    "остаток",
  ]);
  const [showColumnList, setShowColumnList] = useState(false);
  const columnsListRef = useRef(null);
  const columnsListBtnRef = useRef(null);
  const columns = ["название", "артикул", "цена", "остаток"];

  const [isNewProduct, setIsNewProduct] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesObj, setCategoriesObj] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [isCategoriesSettingsOpen, setIsCategoriesSettingsOpen] =
    useState(false);

  const [isShowArchive, setIsShowArchive] = useState(false);

  const categoriesSettingsInputRef = useRef(null);
  const categoriesSettingsRef = useRef(null);

  const warehouseTableBtnContainerRef = useRef(null);

  const { errorText, successText, setErrorText, setSuccessText, resetErrorText, resetSuccessText } = NotificationStore;

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

  useEffect(() => {
    const handleDocumentClick = (event) => {
      
      if (!event.target.closest(".table") && initialCheckboxStates !== undefined) {
        setCheckboxStates(initialCheckboxStates);
        setActiveCheckboxCount(0);
      }
    };
  
    document.addEventListener("click", handleDocumentClick);
  
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [initialCheckboxStates])

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
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized: Please log in again.');
      } else {
        console.error(error);
        setErrorText(e.response.data.detail);
      }
      
    }
  }


  async function fetchProducts(isArchived) {
    try {
      const response = await getProducts(isArchived);
      // console.log(response.data)
      dispatch(setProductsNA(response.data));
      initialCheckboxStates = response.data.reduce((acc, row) => {
        acc[row.id] = false;
        return acc;
      }, {});
      setCheckboxStates(initialCheckboxStates);
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail);
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
    fetchProducts(false);
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      filterProductsByCategories(categories[0]);
      setSelectedCategory(categories[0]);
    }
  }, [categories, productsNA]);

  async function toArchive(idArr, key, newValue) {
    if (idArr.length === 0) return
    try {
      const promises = idArr.map(async (id) => {
        const product = productsNA.find(product => product.id === id);
        const updatedProduct = { ...product, [key]: newValue };
        return patchProduct(id, updatedProduct);
      });
  
      const responses = await Promise.all(promises);
      fetchCategories();
      fetchProducts(false);
      setSuccessText("Продукт в архиве")
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail);
    }
  }

  async function deleteSelectedProducts(idArr) {
    try {
      const response = await deleteProducts(idArr);
      setSuccessText('Продукты удалены')
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail);
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
        setSuccessText('Категория удалена!')
      } catch (e) {
        console.error(e)
        setErrorText(e.response.data.detail);
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
      setIsCategoriesSettingsOpen(false)
      setSuccessText('Категория создана!')
    } catch (e) {
      console.error(e)
      setErrorText(e.response.data.detail);
      // console.log(e.response.data.detail)
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
                {row.images.length !== 0 ? (
                  <img
                    className="column-name__img"
                    src={getFullImageUrl(serverUrl, row.images[0].url)}
                    alt="img"
                  />
                ) : null}
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
        return row?.modifications[0]?.article ? (
          <div
            className={`products-column-container column-article__container ${
              isChecked ? "product-colums-selected" : ""
            }`}
          >
            {getArticleName(row?.modifications[0]?.article)}
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
        const remainingSum = row.modifications.reduce((acc, modification) => acc + modification.remaining, 0);
        return (
          <div
            className={`products-column-container column-remains__container ${
              isChecked ? "product-colums-selected" : ""
            }`}
          >
            {remainingSum + " " + row.measure}
          </div>
        );
      },
    },
    // "в архив": {
    //   className: "products-column column-archive",
    //   content: (row) => {
    //     return !row.archived ? (
    //       <div
    //         className={`products-column-container column-archive__container`}
    //       >
    //         <button
    //           className="column-archive__btn"
    //           onClick={() => toArchive(row.id, "archived", true)}
    //         >
    //           <img
    //             src={archiveBtn}
    //             alt="archive-btn"
    //             className="column-archive__img"
    //           />
    //           <img
    //             src={archiveBtnHover}
    //             alt="archive-btn"
    //             className="column-archive__img--hover"
    //           />
    //         </button>
    //       </div>
    //     ) : null;
    //   },
    // },
  };

  const renderCategoriesBtn = () => {
    return categories.map((category, index) => (
      <button
        key={index}
        className={`products__nav-btn  ${
          selectedCategory === category ? "products__nav-btn--selected" : ""
        }`}
        onClick={() => {
          filterProductsByCategories(category);
          setSelectedCategory(category);
        }}
        data-tooltip-id="category-tooltip"
        data-tooltip-content={category}
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
            <PopularButton
              text={"+ Товар"}
              isHover={true}
              onClick={() => setIsNewProduct(!isNewProduct)}
            />
            {isNewProduct && (
              <div className="newProduct-overlay">
                <Product
                  configName="newProductConfig"
                  currentProductObj={null}
                  showNewProduct={setIsNewProduct}
                />
              </div>
            )}
            <div className="products-header-vert-separator"></div>
            <PopularButton
              text={"Архив"}
              isHover={true}
              onClick={() => setIsShowArchive(!isShowArchive)}
            />
            {isShowArchive && (
              <ProductTable
                showArchive={setIsShowArchive}
                configName="archiveConfig"
              />
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
              className="column-archive__btn"
              onClick={() => toArchive(activeCheckboxIds, "archived", true)}
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
            <button
              className="warehouse-table-btn  warehouse-table-btn__delete-table"
              onClick={() => {
                deleteSelectedProducts(activeCheckboxIds);
                fetchProducts(false);
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
                  <FilterDropDownList />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Номер заказа</p>
                  <FilterDropDownList />
                </div>
                <div className="filter__item">
                  <p className="filter__text">Номер заказа</p>
                  <FilterDropDownList />
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
        <Tooltip id="category-tooltip" />
      </div>
      {errorText && <NotificationManager errorMessage={errorText} resetFunc={resetErrorText}/>}
      {successText && <NotificationManager successMessage={successText} resetFunc={resetSuccessText} />}
    </>
  );
});

export default Products;
