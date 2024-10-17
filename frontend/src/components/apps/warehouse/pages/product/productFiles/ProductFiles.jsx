import React, { useEffect, useState } from "react";
import './ProductFiles.css'
import { useOutletContext } from 'react-router-dom';
import tshirts from '../../../../../../assets/img/tshirts.svg'

const ProductFiles = () => {
  const { currentProduct, setCurrentProduct, currentConfig } = useOutletContext();
  const columnFilesHeaders = ['изображение', 'название', 'размер', 'дата', 'сотрудник'];
  const [currentProductsFiles, setCurrentProductsFiles] = useState([])

  const columnConfig = {
    изображение: {
      className: "product-file-column",
      content: (row) => {
        return (
        // (row.image != false && row.url != null) && 
          <div className="product-file-column__container">
            {/* <img src={tshirts} alt="img" className="product-file-column__img"/> */}
            {row.img}
            {/* src={getFullImageUrl(serverUrl, image.url)} */}
          </div>
        );
      },
    },
    название:{
      className: "product-file-column",
      content: (row) => {
        return (
        // (row.image != false && row.url != null) && 
          <div className="product-file-column__container">
            {row.url}
          </div>
        );
      },
    },
    размер: {
      className: "product-file-column",
      content: (row) => {
        return row.size != null && (
          <div className="product-file-column__container">
            {row.size}
          </div>
        );
      },
    },
    дата: {
      className: "product-file-column",
      content: (row) => {
        return (
        // row.size != null && 
          <div className="product-file-column__container">
            {row.date}
          </div>
        );
      },
    },
    сотрудник: {
      className: "product-file-column",
      content: (row) => {
        return (
        // row.size != null && 
          <div className="product-file-column__container">
            {row.employer}
          </div>
        );
      },
    },
  };

  useEffect(() => {
    setCurrentProductsFiles(currentProduct.files)
  }, [currentProduct])

  const mocData = [
    {
      "img": tshirts,
      'url': 'smuta.png',
      'size': 10,
      'date': '18.09.2024',
      "employer": 'сотрудник',
    }
]

  const renderHeaders = () => {
    return columnFilesHeaders.map((column, index) => (
      <th key={index} className="product-file-column-header">
        {column}
      </th>
    ));
  };

  const renderRows = () => {
    return mocData.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {columnFilesHeaders.map((column, colIndex) => {
          const className = columnConfig[column]?.className;
          return (
            <td key={colIndex} className={className}>
              {columnConfig[column]?.content(row)}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <table className="product-files-table">
        <thead className="product-files-table__header">
          <tr>{renderHeaders()}</tr>
        </thead>
        <tbody>{renderRows()}</tbody>
    </table>
  );
};

export default ProductFiles;
