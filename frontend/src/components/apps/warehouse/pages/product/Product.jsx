import React, {useState, useRef, useEffect} from "react";
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

const Product = ({ currentProductObj }) => {
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const { currentProduct, setCurrentProduct } = currentProductObj || {};
  const [productsImages, setProductsImages] = useState([]);

  useEffect(() => {
    if (currentProduct && currentProduct.images) {
      setProductsImages(currentProduct.images);
    }
  }, [currentProduct]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    try {
      const uploadPromises = files.map(async (file) => {
        try {
          const response = await uploadProductImg(id, file);
          setProductsImages((prevImages) => [...prevImages, response]);
        } catch (error) {
          console.error("Ошибка при загрузке файла:", error);
        }
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Ошибка при чтении или загрузке файлов:", error);
    }
  };

  const renderImgDragAndDrop = () => (
    <form className="img-dragAndDrop">
      <div className="img-dragAndDrop__upload-zone">
        <p className="img-dragAndDrop__upload-zone-plus">+</p>
      </div>
    </form>
  );

  const renderImg = (imgArr) => (
    <div className="product-img__container">
      {imgArr.map((image) => (
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
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

  return (
    <div className="product__content">
      <div className="product-img__content">
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
      <div className="product__content-info">
        <div className="product__name">
          <input
            className="product__name-input"
            value={currentProduct?.name || ""}
            onChange={(e) => handleChange(e, "name")}
          />
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
                location.pathname === `/products/${id}/files` ? "active" : ""
              }`}
              // to={`/products/${id}/files`}
            >
              Файлы
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
                location.pathname === `/products/${id}/history` ? "active" : ""
              }`}
              // to={`/products/${id}/history`}
            >
              История
            </Link>
          </div>
          <div className="product__navbar-modification">
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
          </div>
        </div>
        <Outlet context={{ currentProduct, setCurrentProduct }} />
      </div>
    </div>
  );
};

export default Product;
