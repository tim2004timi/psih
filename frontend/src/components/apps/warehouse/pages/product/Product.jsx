import React, { useState, useRef, useEffect } from "react";
import {
  Link,
  useParams,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  createProduct,
  patchProduct,
  uploadProductImg,
  deleteProductImg,
} from "../../../../../API/productsApi";
import { serverUrl } from "../../../../../config.js";
import getFullImageUrl from "../../../../../API/getFullImgUrl";
import close from "../../../../../assets/img/close_filter.png";
import "./Product.css";

const Product = ({ currentProductArr, configName, showNewProduct }) => {
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const [currentProduct, setCurrentProduct] = useState(
    {
      "name": "",
      "description": "",
      "min_price": 0,
      "cost_price": 0,
      "price": 0,
      "discount_price": 0,
      "category_id": null,
      "measure": "шт.",
      "size": "S",
      "remaining": 0,
      "archived": false
    }
  );
  const [productsImages, setProductsImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);

  useEffect(() => {
    setCurrentConfig(returnConfig(configName));
  }, [configName]);

  // useEffect(() => {
  //   console.log('product', currentProduct)
  // }, [currentProduct])

  useEffect(() => {
    if (currentProductArr && currentProductArr[0]) {
      setCurrentProduct(currentProductArr[0]);
    }
  }, [currentProductArr]);

  const returnConfig = (configName) => {
    switch (configName) {
      case "newProductConfig":
        return {
          showNewProductsBtn: true,
          showRemainsInfo: false,
          wrapperClassName: "product__content--new",
          newProductFlag: true,
        };
      case "productPageConfig":
        return {
          showNewProductsBtn: false,
          showRemainsInfo: true,
          wrapperClassName: "product__content--page",
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    if (currentProduct && currentProduct.images) {
      setProductsImages(currentProduct.images);
      // console.log(productsImages)
    }
  }, [currentProduct]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);

    if (id == undefined) {
      files.forEach((file) => {
        setProductsImages((prevImages) => [...prevImages, file]);
      });
      return;
    }

    uploadImages(files, id);

    // await Promise.all(uploadPromises);
  };

  const uploadImages = (files, id) =>
    files.map(async (file) => {
      try {
        const response = await uploadProductImg(id, file);
        setProductsImages((prevImages) => [...prevImages, response]);
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
      }
    });

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
        className={`img-dragAndDrop__upload-zone ${
          isDragging ? "dragging" : ""
        }`}
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
          style={{ display: "none" }}
          id="file-input"
        />
      </div>
    </form>
  );

  const renderImg = (imgArr) => (
    <div className="product-img__container">
      {imgArr.map((image) => {
        // console.log(image)
        return currentConfig.newProductFlag ? (
          <div 
          key={image.name} 
          className="product__img-item">
            <button
              className="product__img-btn"
              onClick={() => removeImg(image.name)}
            >
              <div className="product__img-btn--minus"></div>
            </button>
            <img
              src={URL.createObjectURL(image)}
              alt="img"
              className="product__img-img"
            />
          </div>
        ) : (
          <div key={image.id} className="product__img-item">
            <button
              className="product__img-btn"
              onClick={() => removeImg(image.id)}
            >
              <div className="product__img-btn--minus"></div>
            </button>
            <img
              src={getFullImageUrl(serverUrl, image.url)}
              alt="img"
              className="product__img-img"
            />
          </div>
        );
      })}
    </div>
  );

  const renderImgContent = () =>
    productsImages && productsImages.length > 0
      ? renderImg(productsImages)
      : renderImgDragAndDrop();

  const removeImg = async (cnt) => {
    if (currentConfig.newProductFlag) {
      try {
        setProductsImages((prevImages) =>
          prevImages.filter((img) => img.name !== cnt)
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        await deleteProductImg(cnt);
        setProductsImages((prevImages) =>
          prevImages.filter((img) => img.id !== cnt)
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    renderImgContent();
  }, [productsImages]);

  const handleClick = () => fileInputRef.current.click();

  const handleChange = (e, field) => {
    const value = e.target.value;
    setCurrentProduct((prev) => ({ ...prev, [field]: value }));
};

  const handleUpdate = (e, field) => {

    if (currentConfig.newProductFlag){
      return
    }

    const value = e.target.value;
    updateProductInfo(field, value);
  }

  const updateProductInfo = async (key, value) => {
    try {
      const updatedProduct = { ...currentProduct, [key]: value };
      const response = await patchProduct(id, updatedProduct);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const isImportantFieldsFilled = (currentProduct) => {
    const newFieldValidity = {
      name: currentProduct.name !== '',
      category_id: currentProduct.category_id != null,
      min_price: currentProduct.min_price > 0,
      cost_price: currentProduct.cost_price > 0,
      price: currentProduct.price > 0,
      discount_price: currentProduct.discount_price > 0,
    };
  
    return Object.values(newFieldValidity).every(isValid => isValid);
  }

  async function createNewProduct(currentProduct) {

    if (!isImportantFieldsFilled(currentProduct)) {
      alert('Заполните необходимые поля');
      return;
    }

    try{
      const response = await createProduct(currentProduct);
      // console.log(response.data);
      uploadImages(productsImages, response.data.id);
      showNewProduct(false)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`${currentConfig?.wrapperClassName}`}>
      <div className="product-img__content">
        {currentConfig?.showNewProductsBtn && (
          <div className="product__save-btn">
            <button className="product__save-btn-button" onClick={() => {
              createNewProduct(currentProduct);
              }}>Сохранить</button>
          </div>
        )}
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
              className={`product__name-input ${
                currentProduct?.name === '' ? "warning" : ""
              }`}
              value={currentProduct?.name}
              onChange={(e) => handleChange(e, "name")}
              onBlur={(e) => handleUpdate(e, "name")}
              placeholder="Наименование товара"
            />
          </div>
          {currentConfig?.showNewProductsBtn && (
            <div className="product__content-close">
              <button
                className="product__content-close-btn"
                onClick={() => showNewProduct(false)}
              >
                <img
                  src={close}
                  alt="close product__content"
                  className="product__content-close-img"
                />
              </button>
            </div>
          )}
        </div>
        <div className="product__navbar">
          <div className="product__navbar-content">
            {currentConfig?.newProductFlag ? (
              <Link
                className={`product__navbar-link ${
                  location.pathname === `/products/productdata`
                    ? "active"
                    : ""
                }`}
                to={`/products/productdata`}
              >
                Данные товара
              </Link>
            ) : (
              <Link
                className={`product__navbar-link ${
                  location.pathname === `/products/${id}/productdata`
                    ? "active"
                    : ""
                }`}
                to={`/products/${id}/productdata`}
              >
                Данные
              </Link>
            )}
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
        <Outlet context={{ currentProduct, setCurrentProduct, currentConfig }} />
      </div>
    </div>
  );
};

export default Product;
