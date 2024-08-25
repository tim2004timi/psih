import React from 'react';
import './HeaderButton.css';
 const HeaderButton = ({img, text, ...props}) => {
    return ( 
         <button className="btn" {...props} >
            <img src={img} alt="btn-img" className="btn_img" /> 
        </button>
       )
 }
  
 export default HeaderButton;