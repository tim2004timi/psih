import React, { useRef, useEffect, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import "./ProductPage.css";
import DropDownList from "../../../../dropDownList/DropDownList";
import { useSelector } from "react-redux";
import {
  deleteProduct,
  getProductById,
  getProducts,
} from "../../../../../API/productsApi";
import { serverUrl } from "../../../../../config.js";
import tshirts from "../../../../../assets/img/tshirts.svg";
import getFullImageUrl from "../../../../../API/getFullImgUrl";
import Product from "./Product";
import NotificationManager from "../../../../notificationManager/NotificationManager.jsx";

const ProductPage = () => {
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
  const [errorText, setErrorText] = useState('')

  // async function fetchProductsNA() {
  //   try {
  //     const response = await getProductsNA();
  //     // console.log(response.data);
  //     setProducts(response.data);

  //     setIsLoading(false);
  //   } catch (e) {
  //     console.error(e);
  //     setIsLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   fetchProductsNA();
  // }, []);

  async function fetchProducts(isArchived) {
    try {
      const response = await getProducts(isArchived);
      // console.log(response.data);
      setProducts(response.data);

    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail)
    }
  }

  async function fetchProduct(id) {
    try {
      const response = await getProductById(id);
      setCurrentProduct(response.data);
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail)
    }
  }

  useEffect(() => {
    fetchProducts(null);
    fetchProduct(id)
    setIsLoading(false)
  }, [id]);

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
    } catch (error) {
      console.error(error)
      setErrorText(error.response.data.detail)
    }
  }

  const openDeleteOverlay = () => {
    deleteOverlayRef.current.style.display = "flex";
  };

  const closeDeleteOverlay = () => {
    deleteOverlayRef.current.style.display = "none";
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
      {errorText && <NotificationManager errorMessage={errorText} />}
      <Product currentProductArr={[currentProduct, setCurrentProduct]} configName='productPageConfig'/>
    </>
  );
};

export default ProductPage;
