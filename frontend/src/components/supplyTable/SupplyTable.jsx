import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, Outlet } from "react-router-dom";
import PartyStore from "../../PartyStore";
import close from "../../assets/img/close_filter.png";
import download from "../../assets/img/product_file_download.png";
import { Tooltip } from "react-tooltip";
import { formatDateTime } from "../../API/formateDateTime";
import "./SupplyTable.css";
import getImgName from "../../API/getImgName";
import UserStore from "../../UserStore";

const SupplyTable = ({ configName, showPage, id }) => {
  const [currentConfig, setCurrentConfig] = useState(null);
  const { party, getPartyById, deletePartyFile, uploadPartyFile } = PartyStore;
  const { currentUser, getCurrentUser } = UserStore;
  const [currentParty, setCurrentParty] = useState({});
  const [partyFiles, setPartyFiles] = useState([]);
  const [partyModifications, setPartyModifications] = useState([]);
  const [showColumnList, setShowColumnList] = useState(false);
  const columnsListBtnRef = useRef(null);
  const columnsListRef = useRef(null);
  const columnFilesHeaders = [
    "название",
    "размер",
    "дата",
    "сотрудник",
    "с",
    "x",
  ];
  const columnPartiesHeaders = [
    "наименование",
    "принято",
    "остаток",
    "себестоимость вещи",
    "цена продажи",
    "себестоимость партии",
    "стоимость партии"
  ];
  const [selectedPartiesColumns, setSelectedPartiesColumns] = useState([
    "наименование",
    "принято",
    "остаток",
    "себестоимость вещи",
    "цена продажи",
    "себестоимость партии",
    "стоимость партии"
  ]);
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
        console.log(row.size);
        return (
          row.size != null && (
            <div className="supply-file-column__container">
              {id ? row.size : (row.size / 1000000).toFixed(1) + " мб"}
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

  const columnPartiesConfig = {
    наименование: {
      className: "supply-party-column",
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
            data-tooltip-id="supply-party-name-tooltip"
            data-tooltip-content={fileName}
            className="supply-party-column__container"
          >
            {fileName}
          </div>
        );
      },
    },
    принято: {
      className: "supply-party-column",
      content: (row) => {
        console.log(row.size);
        return (
          row.size != null && (
            <div className="supply-party-column__container">
              {id ? row.size : (row.size / 1000000).toFixed(1) + " мб"}
            </div>
          )
        );
      },
    },
    остаток: {
      className: "supply-party-column",
      content: (row) => {
        return (
          // row.size != null &&
          <div className="supply-party-column__container">
            {formatDateTime(id ? row.created_at : new Date())}
          </div>
        );
      },
    },
    "себестоимость вещи": {
      className: "supply-party-column",
      content: (row) => {
        return (
          // row.size != null &&
          <div className="supply-party-column__container">
            {id ? row.user.username : currentUser.username}
          </div>
        );
      },
    },
    "цена продажи": {
      className: "supply-party-column",
      content: (row) => {
        return (
          <div className="supply-party-column__container">
            <a
              href={id ? row.url : row.name}
              download={id ? row.url : row.name}
              className="supply-party-column__btn"
            >
              <img
                src={download}
                alt="download"
                className="supply-party-column__img"
              />
            </a>
          </div>
        );
      },
    },
    "себестоимость партии": {
      className: "supply-party-column",
      content: (row) => {
        return (
          <div className="supply-party-column__container">
            <button
              className="supply-party-column__btn"
              onClick={() => {
                removeFile(row.id);
              }}
            >
              <img
                src={close}
                alt="close"
                className="supply-party-column__img"
              />
            </button>
          </div>
        );
      },
    },
    "стоимость партии": {
      className: "supply-party-column",
      content: (row) => {
        return (
          <div className="supply-party-column__container">
            <button
              className="supply-party-column__btn"
              onClick={() => {
                removeFile(row.id);
              }}
            >
              <img
                src={close}
                alt="close"
                className="supply-party-column__img"
              />
            </button>
          </div>
        );
      },
    },
  };

  useEffect(() => {
    if (id !== undefined) {
      getPartyById(id);
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
    getCurrentUser();
  }, []);

  

  useEffect(() => {
    setCurrentParty(party);
    if (party.files !== undefined) {
      setPartyFiles(party.files);
    }
    if (party.modifications_in_party !== undefined) {
      setPartyModifications(party.modifications_in_party);
    }
  }, [party]);

  const removeFile = async (fileId) => {
    try {
      if (id != undefined) {
        await deletePartyFile(fileId);
      }
      setPartyFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      );
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail);
    }
  };

  const handleClick = () => fileInputRef.current.click();

  const uploadFiles = (files, id) =>
    files.map(async (file) => {
      try {
        const response = await uploadPartyFile(id, file);
        setPartyFiles((prevFiles) => [...prevFiles, response]);
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
        setErrorText(error.response.data.detail);
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

  // useEffect(() => {
  //   console.log(currentParty)
  // }, [currentParty])

  const handleUpdate = (value, field) => {
    if (id == undefined) return;
    console.log(value, field);
    updateProductInfo(field, value);
  };

  const handleColumnSelect = (column) => {
    if (selectedPartiesColumns.includes(column)) {
      setSelectedPartiesColumns(selectedPartiesColumns.filter((col) => col !== column));
    } else {
      let inserted = false;
      const newSelectedColumns = selectedPartiesColumns.reduce(
        (acc, selectedColumn) => {
          if (
            columnPartiesHeaders.indexOf(column) < columnPartiesHeaders.indexOf(selectedColumn) &&
            !inserted
          ) {
            acc.push(column);
            inserted = true;
          }
          acc.push(selectedColumn);
          return acc;
        },
        []
      );

      if (!inserted) {
        newSelectedColumns.push(column);
      }

      setSelectedPartiesColumns(newSelectedColumns);
    }
  };

  const renderFileHeaders = () => {
    return columnFilesHeaders.map((column, index) => (
      <th key={index} className="supply-file-column-header">
        {column}
      </th>
    ));
  };

  const renderFileRows = () => {
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

  const renderPartiesHeaders = () => {
    return selectedPartiesColumns.map((column, index) => (
      <th key={index} className="supply-party-column-header">
        {column}
      </th>
    ));
  };

  const renderPartiesRows = () => {
    return partyModifications.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {columnFilesHeaders.map((column, colIndex) => {
          const className = columnPartiesConfig[column]?.className;
          const content = columnPartiesConfig[column]?.content(row);

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

  return (
    <div className="supplyTable">
      <div className="supplyTable__header">
        <button className="supplyTable__saveBtn">Сохранить</button>
        <div className="supplyTable__date">
          {id !== undefined
            ? formatDateTime(currentParty.party_date)
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
              value={currentParty.storage}
              onChange={(e) => handleChange(e.target.value, "storage")}
              onBlur={(e) => handleUpdate(e.target.value, "storage")}
            />
          </div>
          <div className="supplyTable__content-item">
            <p className="supplyTable__conterAgent-text">Проект</p>
            <input
              type="text"
              className="supplyTable__conterAgent-input"
              value={currentParty.project}
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
                <tr>{renderFileHeaders()}</tr>
              </thead>
              <tbody>{renderFileRows()}</tbody>
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
      <div className="supplyTable__productTableBtn">
        <button className="supplyTable__productTableBtn-add">
          Добавить товар
        </button>
        <button
          className="warehouse-table__settings-btn"
          ref={columnsListBtnRef}
          onClick={() => {
            setShowColumnList(!showColumnList);
          }}
        ></button>
        {showColumnList && (
            <div className="warehouse-table__settings" ref={columnsListRef}>
              {columnPartiesHeaders.map((column, index) => (
                <div
                  key={index}
                  className="warehouse-table__settings-container"
                >
                  <label className="warehouse-table__settings-item">
                    <div className="warehouse-table__settings-content">
                      {column}
                    </div>
                    <div className="warehouse-table__settings-input">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={selectedPartiesColumns.includes(column)}
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
      <table className="supplyTable-products-table">
        <thead className="supplyTable__table-header">
          <tr>{renderPartiesHeaders()}</tr>
        </thead>
        <tbody>{renderPartiesRows()}</tbody>
      </table>
      <div className="supplyTable__expenses">{`Накладные расходы ${4}`}</div>
      <div className="supplyTable__total">
        <p className="supplyTable__total-costprice">
          {`Общая себестоимость ${4}`}
        </p>
        <p className="supplyTable__total-cost">
          {`Общая стоимость ${4}`}
        </p>
      </div>
    </div>
  );
};

export default SupplyTable;
