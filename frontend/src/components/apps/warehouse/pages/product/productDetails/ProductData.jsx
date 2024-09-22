import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './ProductData.css'; 
import { patchProduct } from '../../../../../../API/productsApi';
import { useParams } from 'react-router-dom';

const ProductData = () => {
    const { id } = useParams();
    const { currentProduct, setCurrentProduct } = useOutletContext();

    const defaultProduct = {
        min_price: '',
        cost_price: '',
        price: '',
        discount_price: '',
        article: '',
        measure: '',
        description: '',
    };

    const product = { ...defaultProduct, ...currentProduct };

    const handleChange = (e, field) => {
        const value = e.target.value;
        setCurrentProduct((prev) => ({ ...prev, [field]: value }));

        updateProductInfo(field, value);
    };

    const updateProductInfo = async (key, value) => {
        try {
            const response = await patchProduct(id, key, value);
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     console.log(currentProduct);
    // }, [currentProduct]);

    return (
      <div className="product-data">
        <div className="product-data__price-info">
          <div className="product-data__group product-data__item">
            <p className="product-data__group-text product-data__item-text">
              Группа
            </p>
            <div className="product-data__group-list product-data__item-input"></div>
          </div>
          <div className="product-data__min-price product-data__item">
            <p className="product-data__min-price-text product-data__item-text">
              Минимальная цена
            </p>
            <input
              type="text"
              className="product-data__min-price-list product-data__item-input"
              value={product.min_price}
              onChange={(e) => handleChange(e, 'min_price')}
            />
          </div>
          <div className="product-data__cost-price product-data__item">
            <p className="product-data__cost-price-text product-data__item-text">
              Себестоимость
            </p>
            <input
              type="text"
              className="product-data__cost-price-list  product-data__item-input"
              value={product.cost_price}
              onChange={(e) => handleChange(e, 'cost_price')}
            />
          </div>
          <div className="product-data__price product-data__item">
            <p className="product-data__price-text product-data__item-text">
              Цена
            </p>
            <input
              type="text"
              className="product-data__price-list  product-data__item-input"
              value={product.price}
              onChange={(e) => handleChange(e, 'price')}
            />
          </div>
          <div className="product-data__cost-price product-data__item">
            <p className="product-data__cost-price-text product-data__item-text">
              Цена со скидкой
            </p>
            <input
              type="text"
              className="product-data__cost-price-list product-data__item-input"
              value={product.discount_price}
              onChange={(e) => handleChange(e, 'discount_price')}
            />
          </div>
        </div>
        <div className="product-data__personal-info">
          <div className="product-data__personal-info-container">
            <div className="product-data__article product-data__item">
              <p className="product-data__article-text product-data__item-text">
                Артикул
              </p>
              <input
                type="text"
                className="product-data__article-list product-data__item-input"
                value={product.article}
                onChange={(e) => handleChange(e, 'article')}
              />
            </div>
            <div className="product-data__measure-unit product-data__item">
              <p className="product-data__measure-unit-text product-data__item-text">
                Единица измерения
              </p>
              <input
                type="text"
                className="product-data__measure-unit-list product-data__item-input"
                value={product.measure}
                onChange={(e) => handleChange(e, 'measure')}
              />
            </div>
          </div>
          <div className="product-data__description">
            <div className="product-data__description-content">
              <textarea
                className="product-data__description-input product-data__item-input"
                value={product.description || "описание"}
                onChange={(e) => handleChange(e, 'description')}
              />
            </div>
          </div>
        </div>
      </div>
    );
}
 
export default ProductData;