import React, {useState, useRef, useEffect} from 'react';
import './Products.css';
import PopularButton from '../../../../popularButton/PopularButton';
import search from '../../../../../assets/img/search_btn.svg'
import HeaderButton from '../../../../headerApp/headerButton/HeaderButton';
import settings from '../../../../../assets/img/table__settings.png'
import plus from '../../../../../assets/img/plus_zakaz.svg'
import close from '../../../../../assets/img/close_filter.png'
import { Link } from 'react-router-dom';
import FilterDropDownList from '../../../../filterDropDownList/FilterDropDownList';
import szhatie from '../../../../../assets/img/szhatie-strok.png';
import editor from '../../../../../assets/img/editor-btn.png';
import deleteTable from '../../../../../assets/img/delete-table.png';
import archiveBtn from '../../../../../assets/img/toArchive-btn.png';
import archiveBtnHover from '../../../../../assets/img/fromArchive-btn.png';
import { getCategories, getProductsNA, patchProduct } from '../../../../../API/productsApi';

const Products = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);

    const [selectedColumns, setSelectedColumns] = useState(['название', 'артикул', 'цена', 'остаток', 'в архив']);
    const [showColumnList, setShowColumnList] = useState(false);
    const columnsListRef = useRef(null);
    const columnsListBtnRef = useRef(null);
    const columns = ['название', 'артикул', 'цена', 'остаток', 'в архив'];

    const [categories, setCategories] = useState([]);

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const handleColumnSelect = (column) => {
        if (selectedColumns.includes(column)) {
            setSelectedColumns(selectedColumns.filter(col => col !== column));
        } else {
            let inserted = false;
            const newSelectedColumns = selectedColumns.reduce((acc, selectedColumn) => {
                if (columns.indexOf(column) < columns.indexOf(selectedColumn) && !inserted) {
                    acc.push(column);
                    inserted = true;
                }
                acc.push(selectedColumn);
                return acc;
            }, []);

            if (!inserted) {
                newSelectedColumns.push(column);
            }

            setSelectedColumns(newSelectedColumns);
        }
    };

    const openFilter = () => {
        setIsFilterOpen(true);
    };

    const closeFilter = () => {
        setIsFilterOpen(false);
    };

    const handleOutsideClick = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            closeFilter();
        }

        if (columnsListBtnRef.current && columnsListBtnRef.current.contains(event.target)) {
            return;
        }

        if (columnsListRef.current && !columnsListRef.current.contains(event.target) && event.target !== columnsListRef.current) {
            setShowColumnList(false);
        }
    };

    useEffect(() => {
        if (isFilterOpen || showColumnList) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isFilterOpen, showColumnList]);

    async function fetchCategories() {
        try {
            const response = await getCategories();
            const newCategories = response.data.map(obj => obj.name);
            setCategories(prevCategories => [...new Set([...prevCategories, ...newCategories])]);
        } catch (e) {
            console.error(e);
        }
    }

    async function fetchProductsNA() {
        try {
            const response = await getProductsNA();
            setProducts(response.data);
        } catch(e) {
            console.error(e)
        }
    }

    const filterProductsByCategories = (category) => {
        const newProducts = products.filter(product => product.category.name === category);
        setFilteredProducts(newProducts);
    }

    useEffect(() => {
        fetchCategories()
        fetchProductsNA()
    }, [])

    useEffect(() => {
        filterProductsByCategories(categories[0])
    }, [categories])

   async function toArchive(id, key, newValue) {
        try {
            let response = await patchProduct(id, key, newValue);
            console.log(response.data)
        } catch(e) {
            console.error(e)
        }
   }
    
    const columnConfig = {
        'название': {
            className: 'products-column column-name',
            content: (row) => {
                let isChecked = true
                return row.name ? (
                    <div className={`products-column-container column-name__container ${isChecked ? 'product-colums-selected' : ''}`}>
                        {row.name}
                        <div className={`column-name__container-img`}>
                            <img className='column-name__img' src={row.img} alt="img" />
                        </div>
                    </div>
                ) : null;
            }
        },
        'артикул': {
            className: 'products-column column-article',
            content: (row) => {
                let isChecked = true
                return row.article ? (
                    <div className={`products-column-container column-article__container ${isChecked ? 'product-colums-selected' : ''}`}>
                        {row.article}
                    </div>
                ) : null;
            }
        },
        'цена': {
            className: 'products-column column-price',
            content: (row) => {
                let isChecked = true
                return row.price ? (
                    <div className={`products-column-container column-price__container ${isChecked ? 'product-colums-selected' : ''}`}>
                        {row.price + ' ₽'}
                    </div>
                ) : null;
            }
        },
        'остаток': {
            className: 'products-column column-remains',
            content: (row) => {
                let isChecked = true
                return row.remains ? (
                    <div className={`products-column-container column-remains__container ${isChecked ? 'product-colums-selected' : ''}`}>
                        {row.remains + ' шт.'}
                    </div>
                ) : null;
            }
        },
        'в архив': {
            className: 'products-column column-archive',
            content: (row) => {
                return !row.archived ? (
                    <div className={`products-column-container column-archive__container`}>
                        <button className="column-archive__btn" onClick={() => toArchive(row.id, 'archived', true)}>
                            <img src={archiveBtn} alt="archive-btn" className="column-archive__img" />
                            <img src={archiveBtnHover} alt="archive-btn" className="column-archive__img--hover" />
                        </button>
                    </div>
                ) : null;
            }
        }
    }

    const renderCategoriesBtn = () => {
        return categories.map((category, index) => (
            <button key={index} className="productTable__nav-btn" onClick={() => filterProductsByCategories(category)}>{category}</button>
        ));
    };

    const renderHeaders = () => {
        return selectedColumns.map((column, index) => (
            <th key={index} className='products-column-header'>{column}</th>
        ));
    };

    const renderRows = () => {
        return filteredProducts
            // .filter(row => {
            //     if (Object.keys(selectedFilterItems).length === 0) {
            //         return true; 
            //     }
    
            //     const idMatches = selectedFilterItems.id.length === 0 || selectedFilterItems.id.includes(row.id);
            //     const statusMatches = selectedFilterItems.status.length === 0 || selectedFilterItems.status.includes(row.status);
            //     const nameMatches = selectedFilterItems.full_name.length === 0 || selectedFilterItems.full_name.includes(row.full_name);
    
            //     return idMatches && statusMatches && nameMatches;
            // })
            .map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {selectedColumns.map((column, colIndex) => {
                        const className = columnConfig[column]?.className;
                        return (
                            <td 
                                key={colIndex} 
                                className={className}
                            >
                                {columnConfig[column]?.content(row)}
                            </td>
                        );
                    })}
                </tr>
            ));
    };

    return(
        <div>
            <div className="products__header">
                <div className="products__btn-container">
                    <PopularButton text={'Фильтр'} isHover={true} onClick={openFilter} />
                    <Link to="/newproducts">
                        <PopularButton img={plus} text={'Товар'} isHover={true}/>
                    </Link>
                    <div className="products__btn-separator"></div>
                    <Link to="/productsarchive">
                        <PopularButton text={'архив'} isHover={true}/>
                    </Link>
                </div>    
                <div className="productsTable-btn__container">
                    <div className="productsTable-btn__counter">{}</div>
                    <button className='productsTable-btn orderTable-btn__szhatie'>
                        <img className='productsTable-btn__img' src={szhatie} alt="szhatie" />
                    </button>
                    <button className='productsTable-btn orderTable-btn__editor'>
                        <img className='productsTable-btn__img' src={editor} alt="editor" />
                    </button>
                    <button className='productsTable-btn orderTable-btn__deleteTable'>
                        <img className='productsTable-btn__img' src={deleteTable} alt="deleteTable" />
                    </button>
                </div>
                <button className='products__settings-btn' ref={columnsListBtnRef} onClick={() => {setShowColumnList(!showColumnList)}}>
                    <img src={settings} alt="settings" />
                </button>
                {showColumnList && (
                    <div className='products__settings' ref={columnsListRef}>
                        {columns.map((column, index) => (
                            <div key={index} className='products__settings-container'>
                                <label className='products__settings-item'>
                                    <div className="products__settings-content">
                                        {column}
                                    </div>
                                    <div className="products__settings-input">
                                        <input
                                            type="checkbox"
                                            className="custom-checkbox"
                                            checked={selectedColumns.includes(column)}
                                            onChange={() => handleColumnSelect(column)}
                                        />
                                        <span className="checkbox-custom"></span>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="separator"></div>
            {isFilterOpen &&  
                <div className="filter" ref={filterRef}>
                    <div className="filter__content">
                        <div className="closeBtn__container">
                            <HeaderButton onClick={closeFilter} img={close}/>
                        </div>
                        <div className="filter__container">
                            <div className="filter__item">
                                <p className="filter__text">Название</p>
                                <FilterDropDownList />
                            </div>
                            <div className="filter__item">
                                <p className="filter__text">Остаток</p>
                                <FilterDropDownList />
                            </div>
                            <div className="filter__item">
                                <p className="filter__text">Цена</p>
                                <FilterDropDownList />
                            </div>
                        </div>
                        <div className="filter__container">
                            <div className="filter__item">
                                <p className="filter__text">Категории</p>
                                <FilterDropDownList />
                            </div>
                            <div className="filter__item">
                                <p className="filter__text">Артикул</p>
                                <FilterDropDownList />
                            </div>
                        </div>
                        <div className="filter-btn-container">
                            <PopularButton text={'Очистить всё'} isHover={true} />
                            <PopularButton text={'Применить'} isHover={true} />
                        </div>
                    </div>
                </div>
            }
            <div className="productTable">
                <div className="productTable__nav">
                    <p className="productTable__nav-header">категории</p>
                    <div className="productTable__nav-container">
                        {renderCategoriesBtn()}
                        <div className="productTable__nav-add">
                            <span className="productTable__nav-addBtn" onClick={() => console.log('=')}></span>
                        </div>
                    </div>
                </div>
                <div className='productTable__table-wrapper'>
                    <table className="productTable__table">
                        <thead>
                            <tr>
                                {renderHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {renderRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Products