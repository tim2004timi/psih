import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const ProductData = () => {
    const context = useOutletContext();
    useEffect(() => {
        console.log(context)
    }, [context])
    return ( 
        <div className="product-data">
            <div className="product-data__info">
                <div className="product-data__group">
                    <p className="product-data__group-text">Группа</p>
                    <div className="product-data__group-list"></div>
                </div>
                <div className="product-data__min-price">
                    <p className="product-data__min-price-text">Минимальная цена</p>
                    <input type='text' className="product-data__min-price-list" value={context.min_price + ' ₽'}/>
                </div>
                <div className="product-data__cost-price">
                    <p className="product-data__cost-price-text">Себестоимость</p>
                    <input type='text' className="product-data__cost-price-list"value={context.cost_price + ' ₽'} />
                </div>
                <div className="product-data__price">
                    <p className="product-data__price-text">Цена</p>
                    <input type='text' className="product-data__price-list"value={context.price + ' ₽'} />
                </div>
                <div className="product-data__cost-price">
                    <p className="product-data__cost-price-text">Цена со скидкой</p>
                    <input type='text' className="product-data__cost-price-list"value={context.discount_price + ' ₽'} />
                </div>
            </div>
            
        </div>
    );
}
 
export default ProductData;