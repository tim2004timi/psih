import React, { useRef, useEffect, useState } from 'react';
import { Link, useParams, useNavigate, Outlet } from 'react-router-dom';
import './Product.css';
import DropDownList from '../../../../dropDownList/DropDownList';
import { useSelector } from 'react-redux';
import { getProductsNA, deleteProduct } from '../../../../../API/productsApi';
import tshirts from '../../../../../assets/img/tshirts.svg'

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const deleteOverlayRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState({});
    const [productsNames, setProductsNames] = useState([]);
    const [selectedNavBarProduct, setSelectedNavBarProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchProductsNA() {
        try {
            const response = await getProductsNA();
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
            const product = products.find(product => product.id == id);
            setCurrentProduct(product);
        }
    }, [products, id]);

    useEffect(() => {
        if (products.length > 0) {
            const newProductsNames = products.filter(product => product.id !== id).map(product => product.name);
            setProductsNames(newProductsNames);
        }
    }, [products, id]);

    async function deleteProductData(id) {
        try {
            const response = await deleteProduct(id);
            navigate('/products');
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
            await patchOrder(id, key, value);
        } catch (error) {
            console.error(error);
        }
    };

    const openDeleteOverlay = () => {
        deleteOverlayRef.current.style.display = 'flex';
    }

    const closeDeleteOverlay = () => {
        deleteOverlayRef.current.style.display = 'none';
    }

    const renderImg = () => {
        const images = Array.from({ length: 6 }); // Создаем массив из 6 элементов
    
        return (
            <div className="product-img__container">
                {images.map((_, index) => (
                    <div key={index} className="product__img-item">
                        <button className="product__img-btn">
                            <div className="product__img-btn--minus"></div>
                        </button>
                        <img src={tshirts} alt="img" className="product__img-img" />
                    </div>
                ))}
            </div>
        );
    }

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
                    <Link to={'/products'}>
                        <button className="back-btn__btn">
                            <div className="back-btn__arrow"></div>
                        </button>
                    </Link>
                </div>
                <div className="selectOrder">
                    <DropDownList
                        selectedItemText={''}
                        items={products}
                        isItemLink={true}
                        startItem={currentProduct?.name}
                        statusList={false}
                        currentPage='products'
                    />
                </div>
                <div className="delete-btn">
                    <button className="delete-btn__btn" onClick={() => openDeleteOverlay()}>Удалить</button>
                </div>
            </div>
            <div className="deleteOverlay" ref={deleteOverlayRef}>
                <div className="deleteContent">
                    <h2 className="deleteContent__title">Удалить заказ ?</h2>
                    <div className="deleteContent__btn-container">
                        <button className='deleteContent__btn-cancel' onClick={() =>
                            closeDeleteOverlay()
                        }>Отмена</button>
                        <button className='deleteContent__btn-delete' onClick={() => {
                            deleteProductData(currentProduct.id)
                        }}>Удалить</button>
                    </div>
                </div>
            </div>
            <div className="product__separator"></div>
            <div className="product__content">
                <div className="product-img__content">
                    {renderImg()}
                </div>
                <div className="product__content-info">
                    <div className="product__name">
                        <input
                            className='product__name-input'
                            value={currentProduct?.name || ''}
                            onChange={(e) => handleChange(e, 'name')}
                        />
                    </div>
                    <div className="product__navbar">
                        <div className="product__navbar-content">
                            <Link className={`product__navbar-link`} to={`/products/${id}/productdata`}>Данные товара</Link>
                            <Link className={`product__navbar-link`}>Остатки</Link>
                            <Link className={`product__navbar-link`}>Файлы</Link>
                        </div>
                        <div className="product__navbar-content">
                            <Link className={`product__navbar-link`}>Создать модификацию</Link>
                            <Link className={`product__navbar-link`}>Доставка</Link>
                            <Link className={`product__navbar-link`}>История</Link>
                        </div>
                    </div>
                    <Outlet context={currentProduct}/>
                </div>    
            </div>
        </>
    );
}

export default Product;