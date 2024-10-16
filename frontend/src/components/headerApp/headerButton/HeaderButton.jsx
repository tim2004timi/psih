import React from 'react';
import './HeaderButton.css';

const HeaderButton = ({ img, text, as: Component = 'button', ...props }) => {
    return ( 
        <Component className="btn" {...props}>
            <img src={img} alt="btn-img" className="btn_img" /> 
            {text && <span>{text}</span>}
        </Component>
    );
}

export default HeaderButton;