import React, {useState, useEffect, useRef, useCallback} from "react";
import { Link } from "react-router-dom";
import deleteTable from "../../../../assets/img/delete-table.png";
import archiveBtn from "../../../../assets/img/toArchive-btn.png";
import archiveBtnHover from "../../../../assets/img/fromArchive-btn.png";
import categoreisClose from "../../../../assets/img/categories_closebtn.svg";
import {
  getCategories,
  getProductsNA,
  getProductsA,
  patchProduct,
  deleteCategory,
  createCategory,
  deleteProducts,
} from "../../../../API/productsApi";
import { serverUrl } from "../../../../config.js";
import getFullImageUrl from "../../../../API/getFullImgUrl";
import './ProductTable.css';
import search from '../../../../assets/img/search_btn.svg';
import close from '../../../../assets/img/close_filter.png';

const ProductTable = ({ showArchive, configName }) => {
  //   const productsNA = useSelector((state) => state.productsNA.productsNA);
  const [productsNA, setProductsNA] = useState([]);
  const [productsA, setProductsA] = useState([]);

  const [selectedColumns, setSelectedColumns] = useState([
    "название",
    "артикул",
    "цена",
    "остаток",
  ]);

  const [checkboxStates, setCheckboxStates] = useState({});
  const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
  const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);

  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesObj, setCategoriesObj] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [isCategoriesSettingsOpen, setIsCategoriesSettingsOpen] =
    useState(false);

  const categoriesSettingsInputRef = useRef(null);
  const categoriesSettingsRef = useRef(null);

  const [currentConfig, setCurrentConfig] = useState(null);

  // useEffect(() => {
  //   console.log(configName)
  // }, [configName])

  useEffect(() => {
    setCurrentConfig(returnConfig(configName));
  }, [configName]);

  const returnConfig = (configName) => {
    switch (configName) {
      case "archiveConfig":
        return {
          fetchFunc: fetchProductsA,
          isShowComponentHeader: true,
          // getCurrentProducts: getProducts,
        };
      default:
        return null;
    }
  };

  useEffect(() => {

    if (currentConfig) {
      fetchCategories();
      currentConfig.fetchFunc();
    }

  }, [currentConfig]);

  useEffect(() => {
    
    if (categories.length > 0) {
      filterProductsByCategories(categories[0]);
      setSelectedCategory(categories[0]);
    }

  }, [categories, productsA, productsNA]);

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
      // console.log(response.data)
      setProductsNA(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchProductsA() {
    try {
      const response = await getProductsA();
      setProductsA(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  // const getProducts = () => {
  //   switch (configName) {
  //     case "archiveConfig":
  //       return productsA;
  //     default:
  //       return productsNA;
  //   }
  // };

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
    setActiveCheckboxCount(Math.floor(activeCheckboxCount));
    setActiveCheckboxIds(
      activeCheckboxIds.filter(
        (item, index) => activeCheckboxIds.indexOf(item) === index
      )
    );
  }, [activeCheckboxCount]);

  // useEffect(() => {
  //   if (currentConfig) {
  //     console.log(currentConfig.getCurrentProducts());
  //   }
  // }, [productsA, currentConfig]);

  const filterProductsByCategories = (category) => {
    const products = currentConfig.isShowComponentHeader ? productsA : productsNA;
    const newProducts = products.filter(
      (product) => product.category.name === category
    );
    setFilteredProducts(newProducts);
  };

  async function toArchive(idArr) {
    try {
      const promises = idArr.map(async (id) => {
        const product = productsNA.find(product => product.id === id);
        const updatedProduct = { ...product, "archived": true };
        return patchProduct(id, updatedProduct);
      });
  
      const responses = await Promise.all(promises);
      // fetchCategories();
      currentConfig.fetchFunc();
    } catch (e) {
      console.error(e);
    }
  }

  async function fromArchive(idArr) {
    try {
      const promises = idArr.map(async (id) => {
        const product = productsA.find(product => product.id === id);
        const updatedProduct = { ...product, "archived": false };
        return patchProduct(id, updatedProduct);
      });
  
      const responses = await Promise.all(promises);
      // fetchCategories();
      currentConfig.fetchFunc();
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteSelectedProducts(idArr) {
    try {
      const response = await deleteProducts(idArr);
      // fetchCategories();
      currentConfig.fetchFunc();
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
      className: "products-table-column column-pt-name",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.name ? (
          <div
            className={`products-table-column-container column-pt-name__container ${
              isChecked ? "products-table-colums-selected" : ""
            }`}
          >
            <div className={`column-pt-number-input__container`}>
              <input
                type="checkbox"
                className="column-pt-number-input-products"
                checked={isChecked}
                readOnly
              />
              <span
                className="column-pt-number-input__custom-products"
                onClick={(event) => {
                  handleCheckboxChange(row.id, event);
                  event.preventDefault();
                }}
              ></span>
            </div>
            <div className="column-pt-number__content">
              <Link to={`/products/${row.id}`}>{row.name}</Link>
              <div className={`column-pt-name__container-img`}>
                {row.images.length !== 0 ? (
                  <img
                    className="column-pt-name__img"
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
      className: "products-table-column column-pt-article",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.article ? (
          <div
            className={`products-table-column-container column-pt-article__container ${
              isChecked ? "products-table-colums-selected" : ""
            }`}
          >
            {row.article}
          </div>
        ) : null;
      },
    },
    цена: {
      className: "products-table-column column-pt-price",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return (
          <div
            className={`products-table-column-container column-pt-price__container ${
              isChecked ? "products-table-colums-selected" : ""
            }`}
          >
            {row.price + " ₽"}
          </div>
        );
      },
    },
    остаток: {
      className: "products-table-column column-pt-remains",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return (
          <div
            className={`products-table-column-container column-pt-remains__container ${
              isChecked ? "products-table-colums-selected" : ""
            }`}
          >
            {row.remaining + " " + row.measure}
          </div>
        );
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
      <th key={index} className="product-table__column-header">
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
    <div className="product-table">
      <div className="product-table__wrapper">
        <div className="product-table__navbar">
          <div className="product-table__saveBtn">
            <button className="product-table__saveBtn-button">Сохранить</button>
          </div>
          <div className="product-table__navbar-container">
            {renderCategoriesBtn()}
            {/* <div className="product-table__navbar-add">
              <span
                className="product-table__navbar-addBtn"
                onClick={() =>
                  setIsCategoriesSettingsOpen(!isCategoriesSettingsOpen)
                }
              ></span>
            </div> */}
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
        <div className="product-table__content">
          <div className="product-table__content-header">
            <div className="product-table-content__search">
              <button className="product-table-content__search-btn">
                <img
                  src={search}
                  alt="search btn"
                  className="product-table-content__search-img"
                />
                Поиск
              </button>
            </div>
            <div className="product-table-content__close">
              <button
                className="product-table-content__close-btn"
                onClick={() => showArchive(false)}
              >
                <img
                  src={close}
                  alt="close btn"
                  className="product-table-content__close-btn-img"
                />
              </button>
            </div>
          </div>
          <div className="product-table__separator"></div>
          <div className="product-table__table-btn">
            <div className="warehouse-table-btn__counter">
              {activeCheckboxCount}
            </div>
            <button
              className="column-archive__btn"
              onClick={() => fromArchive(activeCheckboxIds)}
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
              }}
            >
              <img
                className="warehouse-table-btn__img"
                src={deleteTable}
                alt="deleteTable"
              />
            </button>
          </div>
          <div className="product-table__separator"></div>
          <table className="product-table__table">
            <thead>
              <tr>{renderHeaders()}</tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
