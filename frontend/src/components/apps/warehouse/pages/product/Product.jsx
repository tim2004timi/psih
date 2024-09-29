import React, { useRef, useEffect, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import "./Product.css";
import DropDownList from "../../../../dropDownList/DropDownList";
import { useSelector } from "react-redux";
import {
  getProductsNA,
  deleteProduct,
  patchProduct,
  getProductById,
  serverUrl
} from "../../../../../API/productsApi";
import tshirts from "../../../../../assets/img/tshirts.svg";
import getFullImageUrl from "../../../../../API/getFullImgUrl";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const deleteOverlayRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const [productsNames, setProductsNames] = useState([]);
  const [selectedNavBarProduct, setSelectedNavBarProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  async function fetchProductsNA() {
    try {
      const response = await getProductsNA();
      // console.log(response.data);
      setProducts(response.data);

      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProductsNA();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const product = products.find((product) => product.id == id);
      setCurrentProduct(product);
    }
  }, [products, id]);

  useEffect(() => {
    if (products.length > 0) {
      const newProductsNames = products
        .filter((product) => product.id !== id)
        .map((product) => product.name);
      setProductsNames(newProductsNames);
    }
  }, [products, id]);

  async function deleteProductData(id) {
    try {
      const response = await deleteProduct(id);
      navigate("/products");
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (e, field) => {
    const value = e.target.value;
    setCurrentProduct((prev) => ({ ...prev, [field]: value }));

    updateProductInfo(field, value);
  };

  const updateProductInfo = async (key, value) => {
    try {
      const response = await patchProduct(id, key, value);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteOverlay = () => {
    deleteOverlayRef.current.style.display = "flex";
  };

  const closeDeleteOverlay = () => {
    deleteOverlayRef.current.style.display = "none";
  };

  const renderImgDragAndDrop = () => {
    return (
      <form className="img-dragAndDrop">
        <div className="img-dragAndDrop__upload-zone">
          <p className="img-dragAndDrop__upload-zone-plus">+</p>
        </div>
      </form>
    );
  };

  const renderImg = (imgArr) => {
    return (
      <div className="product-img__container">
        {imgArr.map((image) => (
          <div key={image.id} className="product__img-item">
            <button className="product__img-btn">
              <div className="product__img-btn--minus"></div>
            </button>
            <img src={getFullImageUrl(serverUrl, image.url)} alt="img" className="product__img-img" />
          </div>
        ))}
      </div>
    );
  }

  const renderImgContent = () => {
    if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
      return renderImg(currentProduct.images);
    } else {
      return renderImgDragAndDrop();
    }
  };

  useEffect(() => {
    renderImgContent();
  }, [currentProduct]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!currentProduct) {
    return <div>Продукт не найден</div>;
  }

  return (
    <>
      <div className="product__header">
        <div className="back-btn">
          <Link to={"/products"}>
            <button className="back-btn__btn">
              <div className="back-btn__arrow"></div>
            </button>
          </Link>
        </div>
        <div className="selectOrder">
          <DropDownList
            selectedItemText={""}
            items={products}
            isItemLink={true}
            startItem={currentProduct.name}
            statusList={false}
            currentPage="products"
          />
        </div>
        <div className="delete-btn">
          <button
            className="delete-btn__btn"
            onClick={() => openDeleteOverlay()}
          >
            Удалить
          </button>
        </div>
      </div>
      <div className="deleteOverlay" ref={deleteOverlayRef}>
        <div className="deleteContent">
          <h2 className="deleteContent__title">Удалить заказ ?</h2>
          <div className="deleteContent__btn-container">
            <button
              className="deleteContent__btn-cancel"
              onClick={() => closeDeleteOverlay()}
            >
              Отмена
            </button>
            <button
              className="deleteContent__btn-delete"
              onClick={() => {
                deleteProductData(currentProduct.id);
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
      <div className="product__separator"></div>
      <div className="product__content">
        <div className="product-img__content">
          {renderImgContent()}
          <div className="product-img__content-load">
            <input type="file" className="product-img__content-input" />
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
                  location.pathname === `/products/${id}/stocks` ? "active" : ""
                }`}
                // to={`/products/${id}/stocks`}
              >
                Остатки
              </Link>
              <Link
                className={`product__navbar-link ${
                  location.pathname === `/products/${id}/files` ? "active" : ""
                }`}
                // to={`/products/${id}/files`}
              >
                Файлы
              </Link>
            </div>
            <div className="product__navbar-content">
              <Link
                className={`product__navbar-link ${
                  location.pathname === `/products/${id}/create-modification`
                    ? "active"
                    : ""
                }`}
                // to={`/products/${id}/create-modification`}
              >
                Создать модификацию
              </Link>
              <Link
                className={`product__navbar-link ${
                  location.pathname === `/products/${id}/delivery`
                    ? "active"
                    : ""
                }`}
                // to={`/products/${id}/delivery`}
              >
                Доставка
              </Link>
              <Link
                className={`product__navbar-link ${
                  location.pathname === `/products/${id}/history`
                    ? "active"
                    : ""
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
    </>
  );
};

export default Product;
