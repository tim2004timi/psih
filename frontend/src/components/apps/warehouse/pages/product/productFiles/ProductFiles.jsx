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
import UserStore from '../../../../../../UserStore'
import { observer } from "mobx-react-lite";

const ProductFiles = observer(() => {
  const { currentProduct, setCurrentProduct, currentProductsFiles, setCurrentProductsFiles, currentConfig } =
    useOutletContext();
  const columnFilesHeaders = ["название", "размер", "дата", "сотрудник", "с", 'x'];
  const [isFilesShowDragandDrop, setIsFilesShowDragandDrop] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [errorText, setErrorText] = useState('')
  const {currentUser, getCurrentUser} = UserStore;

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
        let fileName;
        if (currentProduct.id) {
          fileName = getImgName(row.url);
        } else {
          fileName = row.name;
        }
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
            <div className="product-file-column__container">{currentProduct.id ? row.size : row.size + ' байт'}</div>
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
            {formatDateTime(currentProduct.id ? row.created_at : new Date())}
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
            {currentProduct.id ? row.user.username : currentUser.username}
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
              href={currentProduct.id ? row.url : row.name}
              download={currentProduct.id ? row.url : row.name}
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
        if (currentConfig.productPageFlag) {
          await deleteProductFile(fileId);
        }
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
    if (currentConfig?.newProductFlag) {
      getCurrentUser()
    } 
  }, [currentConfig]);

  useEffect(() => {
    if (currentProduct.files != undefined && currentProductsFiles != undefined) {
      setCurrentProductsFiles(currentProduct.files);
    } 
  }, [currentProduct, currentProductsFiles]);

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

    if (currentProduct.id == undefined) {
      files.forEach((file) => {
        setCurrentProductsFiles((prevFiles) => [...prevFiles, file]);
      });
      return;
    }

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
          const content = columnConfig[column]?.content(row);
  
          // Проверка на корректность возвращаемого значения
          if (typeof content !== 'string' && typeof content !== 'number' && !React.isValidElement(content)) {
            console.error(`Invalid content for column ${column}:`, content);
            return null; // или другой fallback
          }
  
          return (
            <td key={colIndex} className={className}>
              {content}
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
});

export default ProductFiles;
