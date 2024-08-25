import React, {useState, useRef, useEffect} from 'react';
import './Products.css';
import PopularButton from '../../../../popularButton/PopularButton';
import search from '../../../../../assets/img/search_btn.svg'
import HeaderButton from '../../../../headerApp/headerButton/HeaderButton';
import settings from '../../../../../assets/img/table__settings.png'
import plus from '../../../../../assets/img/plus_zakaz.svg'
import close from '../../../../../assets/img/close_filter.png'
import { Link } from 'react-router-dom';

const Products = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);

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
    };

    useEffect(() => {
        if (isFilterOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isFilterOpen]);

    return <div>
        <div className="products__header">
                <div className="products__btn-container">
                    <PopularButton text={'Фильтр'} isHover={true} onClick={openFilter} />
                    <Link to="/newproducts">
                        <PopularButton img={plus} text={'Товар'} isHover={true}/>
                    </Link>
                    <PopularButton img={search} text={'Поиск по'} extraclass={'popularButton__search'}/>
                </div>    
                <HeaderButton img={settings} />
            </div>
            <div className="separator"></div>
            {isFilterOpen &&  
                <form className="filter" ref={filterRef}>
                    <div className="filter__content">
                        <div className="closeBtn__container">
                            < HeaderButton onClick={closeFilter} img={close}/>
                        </div>
                        <div className="filter__container">
                            <div className="filter__item">
                                <p className="filter__text">Название</p>
                                <input className='filter__input' type="text" />
                            </div>
                            <div className="filter__item">
                                <p className="filter__text">Остаток</p>
                                <input className='filter__input' type="text" />
                            </div>
                            <div className="filter__item">
                                <p className="filter__text">Цена</p>
                                <input className='filter__input' type="text" />
                            </div>
                        </div>
                        <div className="filter__container">
                            <div className="filter__item">
                                <p className="filter__text">Группа</p>
                                <input className='filter__input' type="text" />
                            </div>
                            <div className="filter__item">
                                <p className="filter__text">Артикул</p>
                                <input className='filter__input' type="text" />
                            </div>
                            <div className="filter__item">
                                <p className="filter__text">Остаток</p>
                                <input className='filter__input' type="text" />
                            </div>
                        </div>
                        <div className="filter-btn-container">
                            <PopularButton text={'Очистить всё'} isHover={true}/>
                            <PopularButton text={'Применить'} isHover={true}/>
                        </div>
                    </div>
                </form>}
    </div>;
}

export default Products