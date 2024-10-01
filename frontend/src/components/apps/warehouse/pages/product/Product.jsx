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
  uploadProductImg,
  serverUrl,
  deleteProductImg,
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
  const fileInputRef = useRef(null);
  const [productsImages, setProductsImages] = useState([]);

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
      console.log(product);
      setProductsImages(product.images)
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

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const removeImg = async (id) => {
    try {
      const response = await deleteProductImg(id);
      setProductsImages((prevImages) => prevImages.filter((img) => img.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
  
    const imagePromises = files.map(async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
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

  useEffect(() => {
    if (currentProduct && currentProduct.images) {
      setProductsImages(currentProduct.images);
    }
  }, [currentProduct]);
  
  useEffect(() => {
    renderImgContent();
  }, [productsImages]);

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
            <button
              className="product__img-btn"
              onClick={() => {
                removeImg(image.id);
              }}
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
  };

  const renderImgContent = () => {
    if (productsImages && productsImages.length > 0) {
      return renderImg(productsImages);
    } else {
      return renderImgDragAndDrop();
    }
  };

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
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
            <button className="product-img__content-load-btn" onClick={handleClick}>Загрузить изображения</button>
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
