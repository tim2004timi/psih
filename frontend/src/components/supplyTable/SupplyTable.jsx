import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, Outlet } from "react-router-dom";
import PartyStore from "../../PartyStore";
import close from "../../assets/img/close_filter.png";
import download from "../../assets/img/product_file_download.png";
import { Tooltip } from "react-tooltip";
import { formatDateTime } from "../../API/formateDateTime";
import "./SupplyTable.css";
import getImgName from '../../API/getImgName'
import UserStore from '../../UserStore'

const SupplyTable = ({ configName, showPage }) => {
  const [currentConfig, setCurrentConfig] = useState(null);
  const { id } = useParams();
  const { party, getPartyById, deletePartyFile, uploadPartyFile } = PartyStore;
  const {currentUser, getCurrentUser} = UserStore;
  const [currentParty, setCurrentParty] = useState({});
  const [partyFiles, setPartyFiles] = useState([])
  const columnFilesHeaders = [
    "название",
    "размер",
    "дата",
    "сотрудник",
    "с",
    "x",
  ];
  const fileInputRef = useRef(null);

  const columnFilesConfig = {
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
      className: "supply-file-column",
      content: (row) => {
        let fileName;
        if (id) {
          fileName = getImgName(row.url);
        } else {
          fileName = row.name;
        }
        return (
          // (row.image != false && row.url != null) &&
          <div
            data-tooltip-id="supply-file-name-tooltip"
            data-tooltip-content={fileName}
            className="supply-file-column__container"
          >
            {fileName}
          </div>
        );
      },
    },
    размер: {
      className: "supply-file-column",
      content: (row) => {
        console.log(row.size)
        return (
          row.size != null && (
            <div className="supply-file-column__container">
              {id ? row.size : (row.size/1000000).toFixed(1) + " мб"}
            </div>
          )
        );
      },
    },
    дата: {
      className: "supply-file-column",
      content: (row) => {
        return (
          // row.size != null &&
          <div className="supply-file-column__container">
            {formatDateTime(id ? row.created_at : new Date())}
          </div>
        );
      },
    },
    сотрудник: {
      className: "supply-file-column",
      content: (row) => {
        return (
          // row.size != null &&
          <div className="supply-file-column__container">
            {id ? row.user.username : currentUser.username}
          </div>
        );
      },
    },
    с: {
      className: "supply-file-column",
      content: (row) => {
        return (
          <div className="supply-file-column__container">
            <a
              href={id ? row.url : row.name}
              download={id ? row.url : row.name}
              className="supply-file-column__btn"
            >
              <img
                src={download}
                alt="download"
                className="supply-file-column__img"
              />
            </a>
          </div>
        );
      },
    },
    x: {
      className: "supply-file-column",
      content: (row) => {
        return (
          <div className="supply-file-column__container">
            <button
              className="supply-file-column__btn"
              onClick={() => {
                removeFile(row.id);
              }}
            >
              <img
                src={close}
                alt="close"
                className="supply-file-column__img"
              />
            </button>
          </div>
        );
      },
    },
  };

  useEffect(() => {
    if (id !== undefined) {
      getPartyById();
    } else {
      setCurrentParty({
        agent_name: "",
        status: "на складе",
        tag: "",
        note: "",
        storage: "",
        project: "",
        phone_number: "",
        modifications_in_party: [],
      });
    }
    getCurrentUser()
  }, []);

  useEffect(() => {
    setCurrentParty(party);
    if (party.files !== undefined) {
      setPartyFiles(party.files)
    }
  }, [party]);

  const removeFile = async(fileId) => {
    try {
      if (id != undefined) {
        await deletePartyFile(fileId);
      }
      setPartyFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      );
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail)
    }
  }

  const handleClick = () => fileInputRef.current.click();

  const uploadFiles = (files, id) =>
    files.map(async (file) => {
      try {
        const response = await uploadPartyFile(id, file);
        setPartyFiles((prevFiles) => [...prevFiles, response]);
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
        setErrorText(error.response.data.detail)
      }
    });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);

    if (id == undefined) {
      files.forEach((file) => {
        setPartyFiles((prevFiles) => [...prevFiles, file]);
      });
      return;
    }

    uploadFiles(files, id);
  };


  const handleChange = (value, field) => {
    setCurrentParty((prev) => ({ ...prev, [field]: value }));
  };

  const renderHeaders = () => {
    return columnFilesHeaders.map((column, index) => (
      <th key={index} className="supply-file-column-header">
        {column}
      </th>
    ));
  };

  const renderRows = () => {
    return partyFiles.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {columnFilesHeaders.map((column, colIndex) => {
          const className = columnFilesConfig[column]?.className;
          const content = columnFilesConfig[column]?.content(row);

          // Проверка на корректность возвращаемого значения
          if (
            typeof content !== "string" &&
            typeof content !== "number" &&
            !React.isValidElement(content)
          ) {
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

  //   const handleUpdate = (value, field) => {
  //     updateProductInfo(field, value);
  //   };

  //   useEffect(() => {
  //     setCurrentConfig(returnConfig(configName));
  //   }, [configName]);

  //   const returnConfig = (configName) => {
  //     switch (configName) {
  //       case "supplyPage":
  //         return {
  //           fetchFunc: fetchProductsA,
  //           isShowComponentHeader: true,
  //           isShowNotifications: false,
  //           // getCurrentProducts: getProducts,
  //         };
  //       default:
  //         return null;
  //     }
  //   };

  return (
    <div className="supplyTable">
      <div className="supplyTable__header">
        <button className="supplyTable__saveBtn">Сохранить</button>
        <div className="supplyTable__date">
          {id !== undefined
            ? formatDateTime(row.party_date)
            : formatDateTime(new Date())}
        </div>
        <Link
          className="supplyTable__close"
          onClick={() => showPage(false)}
          to={"/parties"}
        >
          <img
            src={close}
            alt="supplyTable close"
            className="supplyTable__close-img"
          />
        </Link>
      </div>
      <div className="supplyTable__content">
        <div className="supplyTable__content-items">
          <div className="supplyTable__content-wrapper">
            <div className="supplyTable__content-item">
              <p className="supplyTable__conterAgent-text">Контрагент</p>
              <input
                type="text"
                className="supplyTable__conterAgent-input"
                value={currentParty.agent_name}
                onChange={(e) => handleChange(e.target.value, "agent_name")}
                onBlur={(e) => handleUpdate(e.target.value, "agent_name")}
              />
            </div>
            {id !== undefined && (
              <Link className="supplyTable__conterAgent-message">
                Сообщения
              </Link>
            )}
          </div>
          <div className="supplyTable__content-item">
            <p className="supplyTable__conterAgent-text">Телефон</p>
            <input
              type="text"
              className="supplyTable__conterAgent-input"
              value={currentParty.phone_number}
              onChange={(e) =>
                handleChange(
                  e.target.value.replace(/[^0-9]/g, ""),
                  "phone_number"
                )
              }
              onBlur={(e) =>
                handleUpdate(
                  e.target.value.replace(/[^0-9]/g, ""),
                  "phone_number"
                )
              }
            />
          </div>
        </div>
        <div className="supplyTable__content-items">
          <div className="supplyTable__content-item">
            <p className="supplyTable__conterAgent-text">Склад</p>
            <input
              type="text"
              className="supplyTable__conterAgent-input"
              value={currentParty.agent_name}
              onChange={(e) => handleChange(e.target.value, "storage")}
              onBlur={(e) => handleUpdate(e.target.value, "storage")}
            />
          </div>
          <div className="supplyTable__content-item">
            <p className="supplyTable__conterAgent-text">Проект</p>
            <input
              type="text"
              className="supplyTable__conterAgent-input"
              value={currentParty.phone_number}
              onChange={(e) => handleChange(e.target.value, "project")}
              onBlur={(e) => handleUpdate(e.target.value, "project")}
            />
          </div>
        </div>
        <div className="supplyTable__content-items">
          <div className="supplyTable__content-item">
            <p className="supplyTable__conterAgent-text">Статус</p>
            {/* <input
              type="text"
              className="supplyTable__conterAgent-input"
              value={currentParty.agent_name}
              onChange={(e) =>
                handleChange(e.target.value, "storage")
              }
              onBlur={(e) =>
                handleUpdate(e.target.value, "storage")
              }
            /> */}
          </div>
          <div className="supplyTable__content-item">
            <p className="supplyTable__conterAgent-text">Тег</p>
            {/* <input
              type="text"
              className="supplyTable__conterAgent-input"
              value={currentParty.phone_number}
              onChange={(e) =>
                handleChange(e.target.value, "project")
              }
              onBlur={(e) =>
                handleUpdate(e.target.value, "project")
              }
            /> */}
          </div>
        </div>
        <div className="supplyTable__content-item">
          <p className="supplyTable__conterAgent-text">Заметка</p>
          <textarea
            className="supplyTable__note"
            value={currentParty.note}
            onChange={(e) => handleChange(e.target.value, "note")}
            onBlur={(e) => handleUpdate(e.target.value, "note")}
          />
        </div>
        <div className="supplyTable__content-item">
          <p className="supplyTable__conterAgent-text">Файлы</p>
          <div className="supplyTable__table-wrapper">
            <table className="supplyTable__table">
              <thead className="supplyTable__table-header">
                <tr>{renderHeaders()}</tr>
              </thead>
              <tbody>{renderRows()}</tbody>
            </table>
            <Tooltip id="category-tooltip" />
            <div className="supplyTable__table-add">
              <span
                className="supplyTable__table-add-btn"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyTable;
