import React, { useEffect, useState, useRef } from "react";
import "./ProductFiles.css";
import { useOutletContext } from "react-router-dom";
import tshirts from "../../../../../../assets/img/tshirts.svg";
import download from "../../../../../../assets/img/product_file_download.png";
import close from '../../../../../../assets/img/close_filter.png'
import { uploadProductFile, deleteProductFile } from "../../../../../../API/productsApi";
import { formatDateTime } from "../../../../../../API/formateDateTime";
import getImgName from '../../../../../../API/getImgName'
import { Tooltip } from "react-tooltip";
import NotificationManager from "../../../../../notificationManager/NotificationManager";

const ProductFiles = () => {
  const { currentProduct, setCurrentProduct, currentConfig } =
    useOutletContext();
  const columnFilesHeaders = ["название", "размер", "дата", "сотрудник", "с", 'x'];
  const [currentProductsFiles, setCurrentProductsFiles] = useState([]);
  const [isFilesShowDragandDrop, setIsFilesShowDragandDrop] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [errorText, setErrorText] = useState('')

  const columnConfig = {
    // изображение: {
    //   className: "product-file-column",
    //   content: (row) => {
    //     return (
    //     // (row.image != false && row.url != null) &&
    //       <div className="product-file-column__container">
    //         {/* <img src={tshirts} alt="img" className="product-file-column__img"/> */}
    //         {row.img}
    //         {/* src={getFullImageUrl(serverUrl, image.url)} */}
    //       </div>
    //     );
    //   },
    // },
    название: {
      className: "product-file-column",
      content: (row) => {
        const fileName = getImgName(row.url);
        return (
          // (row.image != false && row.url != null) &&
          <div
            data-tooltip-id="product-file-name-tooltip"
            data-tooltip-content={fileName}
            className="product-file-column__container"
          >
            {fileName}
          </div>
        );
      },
    },
    размер: {
      className: "product-file-column",
      content: (row) => {
        return (
          row.size != null && (
            <div className="product-file-column__container">{row.size}</div>
          )
        );
      },
    },
    дата: {
      className: "product-file-column",
      content: (row) => {
        return (
          // row.size != null &&
          <div className="product-file-column__container">
            {formatDateTime(row.created_at)}
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
            {row.user.username}
          </div>
        );
      },
    },
    с: {
      className: "product-file-column",
      content: (row) => {
        return (
          <div className="product-file-column__container">
            <a
              href={row.url}
              download={row.url}
              className="product-file-column__btn"
            >
              <img
                src={download}
                alt="download"
                className="product-file-column__img"
              />
            </a>
          </div>
        );
      },
    },
    x: {
      className: "product-file-column",
      content: (row) => {
        return (
          <div className="product-file-column__container">
            <button
              className="product-file-column__btn"
              onClick={() => {
                removeFile(row.id);
              }}
            >
              <img
                src={close}
                alt="close"
                className="product-file-column__img"
              />
            </button>
          </div>
        );
      },
    },
  };

  const removeFile = async(fileId) => {
    // if (currentConfig.newProductFlag) {
    //   try {
    //     setProductsImages((prevImages) =>
    //       prevImages.filter((img) => img.name !== cnt)
    //     );
    //   } catch (e) {
    //     console.error(e);
    //     setErrorText(e.response.data.detail)
    //   }
    // } else {
      try {
        await deleteProductFile(fileId);
        setCurrentProductsFiles((prevFiles) =>
          prevFiles.filter((file) => file.id !== fileId)
        );
      } catch (e) {
        console.error(e);
        setErrorText(e.response.data.detail)
      }
    }
  // }

  useEffect(() => {
    setCurrentProductsFiles(currentProduct.files);
  }, [currentProduct]);

  const handleClick = () => fileInputRef.current.click();

  const uploadFiles = (files, id) =>
    files.map(async (file) => {
      try {
        const response = await uploadProductFile(id, file);
        setCurrentProductsFiles((prevFiles) => [...prevFiles, response]);
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
        setErrorText(error.response.data.detail)
      }
    });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);

    uploadFiles(files, currentProduct.id);
  };

  const renderHeaders = () => {
    return columnFilesHeaders.map((column, index) => (
      <th key={index} className="product-file-column-header">
        {column}
      </th>
    ));
  };

  const renderRows = () => {
    return currentProductsFiles.map((row, rowIndex) => (
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
    <div className="product-files-wrapper">
      <table className="product-files-table">
        <thead className="product-files-table__header">
          <tr>{renderHeaders()}</tr>
        </thead>
        <tbody>{currentProductsFiles && renderRows()}</tbody>
      </table>
      <Tooltip id="category-tooltip" />
      <div className="product-files-table__add">
        <span
          className="product-files-table__add-btn"
          // onClick={() => setIsFilesShowDragandDrop(!isFilesShowDragandDrop)}
          onClick={() => handleClick()}
        ></span>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          multiple
          accept="image/*"
        />
      </div>
      {errorText && <NotificationManager errorMessage={errorText} />}
      {/* {isFilesShowDragandDrop && (
        <form className="files-dragAndDrop">
          <div
            className={`files-dragAndDrop__upload-zone ${
              isDragging ? "dragging" : ""
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="files-dragAndDrop__upload-zone-plus">+</p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file-input"
            />
          </div>
        </form>
      )} */}
    </div>
  );
};

export default ProductFiles;
