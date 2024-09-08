import React from 'react';
import './PopularButton.css';

const popularButton = ({img, text, isHover, extraclass, ...props}) => {
    return ( 
        <button className={`popularButton ${isHover ? 'popularButton__hover' : ''}`} {...props}>
            {img 
                ?
            text
                ?
                <div className={`popularButton__container ${extraclass || ''}`}>
                    <img src={img} alt="btn-img" className="popularButton_img" />
                    <span className="popularButton_text">{text}</span>
                </div>
                :
                <img src={img} alt="btn-img" className="popularButton_img" />
                :
                <span className='popularButton_text'>{text}</span>
            } 
        </button>
     );
}
 
export default popularButton;