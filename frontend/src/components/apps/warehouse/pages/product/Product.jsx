import React, { useState, useRef, useEffect } from "react";
import {
  Link,
  useParams,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  getProductsNA,
  deleteProduct,
  patchProduct,
  uploadProductImg,
  serverUrl,
  deleteProductImg,
} from "../../../../../API/productsApi";
import getFullImageUrl from "../../../../../API/getFullImgUrl";
import close from '../../../../../assets/img/close_filter.png';
import './Product.css';

const Product = ({ currentProductObj, configName }) => {
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const { currentProduct, setCurrentProduct } = currentProductObj != undefined ? currentProductObj : {
    "name": "",
    "description": "",
    "min_price": 0,
    "cost_price": 0,
    "price": 0,
    "discount_price": 0,
    "category_id": 0,
    "measure": "шт.",
    "size": "S",
    "remaining": 0,
    "archived": false
  };
  const [productsImages, setProductsImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);

  useEffect(() => {
    setCurrentConfig(returnConfig(configName));
  }, [configName]);

  // useEffect(() => {
  //   console.log(productsImages)
  // }, [productsImages])

  const returnConfig = (configName) => {
    switch (configName) {
      case 'newProductConfig':
        return {
          showSaveBtn: true,
          showRemainsInfo: false,
          wrapperClassName: 'product__content--new'
        };
      case 'productPageConfig':
        return {
          showSaveBtn: false,
          showRemainsInfo: true,
          wrapperClassName: 'product__content--page'
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    if (currentProduct && currentProduct.images) {
      setProductsImages(currentProduct.images);
    }
  }, [currentProduct]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    
    if (id == undefined) {
      setProductsImages((prevImages) => [...prevImages, files]);
      console.log(files)
      return
    }

    const uploadPromises = files.map(async (file) => {
      try {
        const response = await uploadProductImg(id, file);
        setProductsImages((prevImages) => [...prevImages, response]);
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e);
  };

  const renderImgDragAndDrop = () => (
    <form className="img-dragAndDrop">
      <div 
        className={`img-dragAndDrop__upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="img-dragAndDrop__upload-zone-plus">+</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-input"
        />
      </div>
    </form>
  );

  const renderImg = (imgArr) => (
    <div className="product-img__container">
      {imgArr.map((image) => (
        <div key={image[0].size} className="product__img-item">
          <button
            className="product__img-btn"
            // onClick={() => removeImg(image.id)}
            onClick={() => console.log(image[0].name)}
          >
            <div className="product__img-btn--minus"></div>
          </button>
          <img
            // src={getFullImageUrl(serverUrl, image.name)}
            src={URL.createObjectURL(image[0])}
            alt="img"
            className="product__img-img"
          />
        </div>
      ))}
    </div>
  );

  const renderImgContent = () => (
    productsImages && productsImages.length > 0 ? renderImg(productsImages) : renderImgDragAndDrop()
  );

  const removeImg = async (id) => {
    try {
      await deleteProductImg(id);
      setProductsImages((prevImages) => prevImages.filter((img) => img.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    renderImgContent();
  }, [productsImages]);

  const handleClick = () => fileInputRef.current.click();

  const handleChange = (e, field) => {
    const value = e.target.value;
    if (setCurrentProduct) {
      setCurrentProduct((prev) => ({ ...prev, [field]: value }));
      updateProductInfo(field, value);
    } else {
      console.error("setCurrentProduct is not a function");
    }
  };

  const updateProductInfo = async (key, value) => {
    try {
      const updatedProduct = { ...currentProduct, [key]: value };
      const response = await patchProduct(id, updatedProduct);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`${currentConfig?.wrapperClassName}`}>
      <div className="product-img__content">
        {currentConfig?.showSaveBtn && <div className="product__save-btn">
          <button className="product__save-btn-button">Сохранить</button>
        </div>}
        <div className="product__img">
          {renderImgContent()}
          <div className="product-img__content-load">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
            <button
              className="product-img__content-load-btn"
              onClick={handleClick}
            >
              Загрузить изображения
            </button>
          </div>
        </div>
      </div>
      <div className="product__content-info">
        <div className="product__content-header">
          <div className="product__name">
            <input
              className="product__name-input"
              value={currentProduct?.name || ""}
              onChange={(e) => handleChange(e, "name")}
              placeholder="Наименование товара"
            />
          </div>
          <div className="product__content-close">
            <button className="product__content-close-btn">
              <img src={close} alt="close product__content" className="product__content-close-img" />
            </button>
          </div>
        </div>
        <div className="product__navbar">
          <div className="product__navbar-content">
            <Link
              className={`product__navbar-link ${
                location.pathname === `/products/${id}/productdata`
                  ? "active"
                  : ""
              }`}
              to={`/products/${id}/productdata`}
            >
              Данные товара
            </Link>
            <Link
              className={`product__navbar-link ${
                location.pathname === `/products/${id}/delivery` ? "active" : ""
              }`}
              // to={`/products/${id}/delivery`}
            >
              Доставка
            </Link>
            <Link
              className={`product__navbar-link ${
                location.pathname === `/products/${id}/files` ? "active" : ""
              }`}
              // to={`/products/${id}/files`}
            >
              Файлы
            </Link>
            <Link
              className={`product__navbar-link ${
                location.pathname === `/products/${id}/history` ? "active" : ""
              }`}
              // to={`/products/${id}/history`}
            >
              История
            </Link>
          </div>
        </div>
        <Outlet context={{ currentProduct, setCurrentProduct }} />
      </div>
    </div>
  );
};

export default Product;