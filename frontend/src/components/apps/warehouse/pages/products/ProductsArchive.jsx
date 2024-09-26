import React, { useState, useRef, useEffect } from "react";
// import './ProductsArchive.css';
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
import {
  getCategories,
  getProductsA,
  patchProduct,
} from "../../../../../API/productsApi";
import { useDispatch, useSelector } from "react-redux";
import { setProductsNA } from "../../../../stm/productsNASlice";

const ProductsArchive = () => {
  const dispatch = useDispatch();
  const productsNA = useSelector((state) => state.productsNA.productsNA);

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

  const showFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const handleOutsideClick = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      closeFilter();
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

  async function fetchCategories() {
    try {
      const response = await getCategories();
      const newCategories = response.data.map((obj) => obj.name);
      setCategories((prevCategories) => [
        ...new Set([...prevCategories, ...newCategories]),
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchProductsA() {
    try {
      const response = await getProductsA();
      setProducts(response.data);
    } catch (e) {
      console.error(e);
    }
  }

//   const filterProductsByCategories = (category) => {
//     const newProducts = products.filter(
//       (product) => product.category.name === category
//     );
//     setFilteredProducts(newProducts);
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchProductsA();
//   }, []);

//   useEffect(() => {
//     filterProductsByCategories(categories[0]);
//   }, [categories, products]);

  async function toArchive(id, key, newValue) {
    try {
      let response = await patchProduct(id, key, newValue);
      // console.log(response.data)
      fetchProductsA();
    } catch (e) {
      console.error(e);
    }
  }

  const columnConfig = {
    название: {
      className: "productsArchive-column column-name",
      content: (row) => {
        let isChecked = true;
        return row.name ? (
          <div
            className={`productsArchive-column-container column-name__container ${
              isChecked ? "product-colums-selected" : ""
            }`}
          >
            {row.name}
            <div className={`column-name__container-img`}>
              <img className="column-name__img" src={row.img} alt="img" />
            </div>
          </div>
        ) : null;
      },
    },
    артикул: {
      className: "productsArchive-column column-article",
      content: (row) => {
        let isChecked = true;
        return row.article ? (
          <div
            className={`productsArchive-column-container column-article__container ${
              isChecked ? "product-colums-selected" : ""
            }`}
          >
            {row.article}
          </div>
        ) : null;
      },
    },
    цена: {
      className: "productsArchive-column column-price",
      content: (row) => {
        let isChecked = true;
        return (
          <div
            className={`productsArchive-column-container column-price__container ${
              isChecked ? "product-colums-selected" : ""
            }`}
          >
            {row.price + " ₽"}
          </div>
        );
      },
    },
    остаток: {
      className: "productsArchive-column column-remains",
      content: (row) => {
        let isChecked = true;
        return (
          <div
            className={`productsArchive-column-container column-remains__container ${
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
        return row.archived ? (
          <div
            className={`products-column-container column-archive__container`}
          >
            <button
              className="column-archive__btn"
              onClick={() => toArchive(row.id, "archived", false)}
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
        className="productTable__nav-btn"
        onClick={() => filterProductsByCategories(category)}
      >
        {category}
      </button>
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
    return (
      filteredProducts
        // .filter(row => {
        //     if (Object.keys(selectedFilterItems).length === 0) {
        //         return true;
        //     }

        //     const idMatches = selectedFilterItems.id.length === 0 || selectedFilterItems.id.includes(row.id);
        //     const statusMatches = selectedFilterItems.status.length === 0 || selectedFilterItems.status.includes(row.status);
        //     const nameMatches = selectedFilterItems.full_name.length === 0 || selectedFilterItems.full_name.includes(row.full_name);

        //     return idMatches && statusMatches && nameMatches;
        // })
        .map((row, rowIndex) => (
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
        ))
    );
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
            <Link to="/orders/neworder">
              <PopularButton text={"+ Товар"} isHover={true} />
            </Link>
            <div className="products-header-vert-separator"></div>
            <Link to="/productsarchive">
              <PopularButton text={"Архив"} isHover={true} />
            </Link>
          </div>
          <div
            className="warehouse-table-btn__container"
            ref={warehouseTableBtnContainerRef}
          >
            <div className="warehouse-table-btn__counter">
              {/* {activeCheckboxCount} */}
              0
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
                // deleteSelectedOrders(activeCheckboxIds);
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
      <div className="productTable">
        <div className="productTable__nav">
          <p className="productTable__nav-header">категории</p>
          <div className="productTable__nav-container">
            {renderCategoriesBtn()}
            <div className="productTable__nav-add">
              <span
                className="productTable__nav-addBtn"
                onClick={() => console.log("=")}
              ></span>
            </div>
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

export default ProductsArchive;
