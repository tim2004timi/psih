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
  getProductsNA,
  deleteProduct,
  patchProduct,
  uploadProductImg,
  serverUrl,
  deleteProductImg,
} from "../../../../../API/productsApi";
import tshirts from "../../../../../assets/img/tshirts.svg";
import getFullImageUrl from "../../../../../API/getFullImgUrl";
import Product from "./Product";

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
      // console.log(product);
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

  const openDeleteOverlay = () => {
    deleteOverlayRef.current.style.display = "flex";
  };

  const closeDeleteOverlay = () => {
    deleteOverlayRef.current.style.display = "none";
  };

  useEffect(() => {
    if (currentProduct && currentProduct.images) {
      setProductsImages(currentProduct.images);
    }
  }, [currentProduct]);
  
  useEffect(() => {
    renderImgContent();
  }, [productsImages]);

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
      <Product currentProduct={currentProduct} productsImages={productsImages}/>
    </>
  );
};

export default ProductPage;
