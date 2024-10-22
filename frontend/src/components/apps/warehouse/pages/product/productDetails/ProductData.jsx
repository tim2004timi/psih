import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import './ProductData.css'; 
import { patchProduct } from '../../../../../../API/productsApi';
import { useParams } from 'react-router-dom';
import { getCategories } from '../../../../../../API/productsApi';
import NotificationManager from "../../../../../notificationManager/NotificationManager";

const ProductData = () => {
    const { id } = useParams();
    const { currentProduct, setCurrentProduct, currentConfig } = useOutletContext();
    const [productsModification, setProductsModification] = useState({});
    const [currentProductsModification, setCurrentProductsModification] = useState(null);
    const [categoriesObj, setCategoriesObj] = useState([]);
    const [groupListSelectedItem, setGroupListSelectedItem] = useState('');
    const [isShowGroupList, setIsShowGroupList] = useState(false);
    const [errorText, setErrorText] = useState('');

    useEffect(() => {
      if (currentProduct && currentProduct.modifications) {
        const modificationsMap = currentProduct.modifications.reduce((acc, modification) => {
          acc[modification.size] = { 
            id: modification.id,
            article: modification.article,
            remaining: modification.remaining,
            product_id: modification.product_id,
          };
          return acc;
        }, {});
    
        setProductsModification(modificationsMap);
      }
    }, [currentProduct]);

    const returnCurrentProductsModification = (size) => {
      setCurrentProductsModification(productsModification[size]);
    };

    useEffect(() => {
      if (productsModification && productsModification['L']) {
        returnCurrentProductsModification('L');
      }
    }, [productsModification]);

    // useEffect(() => {
    //   console.log(currentProductsModification);
    // }, [currentProductsModification]);

    const handleChange = (value, field) => {
        setCurrentProduct((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = (value, field) => {
      updateProductInfo(field, value);
    };

    async function fetchCategories() {
      try {
        const response = await getCategories();
        setCategoriesObj(response.data);
      } catch (e) {
        console.error(e);
        setErrorText(e.response.data.detail);
      }
    }

    useEffect(() => {
      if (categoriesObj.length > 0 && currentProduct.category_id) {
          const selectedCategory = categoriesObj.find(category => category.id === currentProduct.category_id);
          if (selectedCategory) {
              setGroupListSelectedItem(selectedCategory.name);
          }
      }
  }, [categoriesObj, currentProduct.category_id]);

    useEffect(() => {
      console.log(productsModification);
    }, [productsModification]);

    useEffect(() => {
      fetchCategories();
    }, []);

    const updateProductInfo = async (key, value) => {
    
      if (currentConfig.newProductFlag){
        return;
      }

      try {
          const updatedProduct = { ...currentProduct, [key]: value };
          const response = await patchProduct(id, updatedProduct);
      } catch (e) {
          console.error(e);
          setErrorText(e.response.data.detail);
      }
    };

    const renderCategoriesList = () => {
      return (
        <div className="product-data__group-list-items">
          {categoriesObj.map((category) => (
            <button 
              key={category.id}
              className='product-data__group-list-button'
              onClick={() => {
                setGroupListSelectedItem(category.name);
                setCurrentProduct((prev) => ({ ...prev, category_id: category.id }));
                setIsShowGroupList(false);
                updateProductInfo("category_id", category.id);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      );
    };

    return (
      <div className="product-data">
        <form className="product-data__form">
          <div className="product-data__price-info">
            <div
              className={`product-data__group product-data__item ${
                currentProduct.category_id == null ? "warning" : ""
              }`}
            >
              <p className="product-data__group-text product-data__item-text">
                Категория
              </p>
              <button
                type="button"
                className="product-data__group-list product-data__item-input"
                onClick={() => setIsShowGroupList(!isShowGroupList)}
              >
                {groupListSelectedItem}
              </button>
              {isShowGroupList && renderCategoriesList()}
            </div>
            <div
              className={`product-data__min-price product-data__item ${
                Number(currentProduct.min_price) <= 0 ? "warning" : ""
              }`}
            >
              <p className="product-data__min-price-text product-data__item-text">
                Минимальная цена
              </p>
              <input
                type="text"
                className="product-data__min-price-list product-data__item-input"
                value={currentProduct.min_price}
                onChange={(e) =>
                  handleChange(
                    e.target.value.replace(/[^0-9]/g, ""),
                    "min_price"
                  )
                }
                onBlur={(e) =>
                  handleUpdate(
                    e.target.value.replace(/[^0-9]/g, ""),
                    "min_price"
                  )
                }
              />
            </div>
            <div
              className={`product-data__cost-price product-data__item ${
                Number(currentProduct.cost_price) <= 0 ? "warning" : ""
              }`}
            >
              <p className="product-data__cost-price-text product-data__item-text">
                Себестоимость
              </p>
              <input
                type="text"
                className="product-data__cost-price-list  product-data__item-input"
                value={currentProduct.cost_price}
                onChange={(e) =>
                  handleChange(
                    e.target.value.replace(/[^0-9]/g, ""),
                    "cost_price"
                  )
                }
                onBlur={(e) =>
                  handleUpdate(
                    e.target.value.replace(/[^0-9]/g, ""),
                    "cost_price"
                  )
                }
              />
            </div>
            <div
              className={`product-data__price product-data__item ${
                Number(currentProduct.price) <= 0 ? "warning" : ""
              }`}
            >
              <p className="product-data__price-text product-data__item-text">
                Цена
              </p>
              <input
                type="text"
                className="product-data__price-list  product-data__item-input"
                value={currentProduct.price}
                onChange={(e) =>
                  handleChange(e.target.value.replace(/[^0-9]/g, ""), "price")
                }
                onBlur={(e) =>
                  handleUpdate(e.target.value.replace(/[^0-9]/g, ""), "price")
                }
              />
            </div>
            <div
              className={`product-data__cost-price product-data__item ${
                Number(currentProduct.discount_price) <= 0 ? "warning" : ""
              }`}
            >
              <p className="product-data__cost-price-text product-data__item-text">
                Цена со скидкой
              </p>
              <input
                type="text"
                className="product-data__cost-price-list product-data__item-input"
                value={currentProduct.discount_price}
                onChange={(e) =>
                  handleChange(
                    e.target.value.replace(/[^0-9]/g, ""),
                    "discount_price"
                  )
                }
                onBlur={(e) =>
                  handleUpdate(
                    e.target.value.replace(/[^0-9]/g, ""),
                    "discount_price"
                  )
                }
              />
            </div>
          </div>
          <div className="product-data__personal-info">
            <div className="product-data__personal-info-container">
              {currentConfig?.showRemainsInfo && (
                <div className="product-data__article product-data__item">
                  <p className="product-data__article-text product-data__item-text">
                    Артикул
                  </p>
                  <input
                    type="text"
                    className="product-data__article-list product-data__item-input"
                    value={currentProductsModification?.article}
                    disabled
                    // onChange={(e) => handleChange(e.target.value, "article")}
                    // onBlur={(e) => handleUpdate(e.target.value, "article")}
                  />
                  {/* <div
                  className="product-data__article-list product-data__item-input"
                >
                  {currentProductsModification?.article}
                </div> */}
                </div>
              )}
              <div className="product-data__measure-unit product-data__item">
                <p className="product-data__measure-unit-text product-data__item-text">
                  Единица измерения
                </p>
                <input
                  type="text"
                  className="product-data__measure-unit-list product-data__item-input"
                  value={currentProduct.measure}
                  onChange={(e) => handleChange(e.target.value, "measure")}
                  onBlur={(e) => handleUpdate(e.target.value, "measure")}
                />
              </div>
            </div>
            <div className="product-data__description">
              <div className="product-data__description-content">
                <textarea
                  className="product-data__description-input product-data__item-input"
                  value={currentProduct.description}
                  placeholder="Описание"
                  onChange={(e) => handleChange(e.target.value, "description")}
                  onBlur={(e) => handleUpdate(e.target.value, "description")}
                />
              </div>
            </div>
          </div>
        </form>
        {currentConfig?.showRemainsInfo && (
          <div className="product-data__remains">
            <p className="product-data__remains-text">Остатки</p>
            <div className="product-data__remains-content">
              {currentProductsModification?.remaining +
                " " +
                currentProduct.measure}
            </div>
          </div>
        )}
        <div className="product-data__size">
          <p className="product-data__size-text">Размеры</p>
          <div className="product-data__size-items">
            {currentProduct?.modifications?.map((modification) => {
              return (
                <button
                  className="product-data__size-item"
                  onClick={() =>
                    returnCurrentProductsModification(modification.size)
                  }
                >
                  {modification.size}
                </button>
              );
            })}
          </div>
        </div>
        {errorText && <NotificationManager errorMessage={errorText} />}
      </div>
    );
}
 
export default ProductData;