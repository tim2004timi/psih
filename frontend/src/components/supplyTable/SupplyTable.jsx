import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useParams, useNavigate, Outlet } from "react-router-dom";
import PartyStore from "../../PartyStore";
import close from "../../assets/img/close_filter.png";
import download from "../../assets/img/product_file_download.png";
import { Tooltip } from "react-tooltip";
import { formatDateTime } from "../../API/formateDateTime";
import "./SupplyTable.css";
import getImgName from "../../API/getImgName";
import UserStore from "../../UserStore";
import { observer } from "mobx-react-lite";
import { getProducts } from "../../API/productsApi";
import { toJS } from "mobx";
import NotificationStore from "../../NotificationStore";
import NotificationManager from "../notificationManager/NotificationManager";
import ProductTable from "../apps/warehouse/productTable/ProductTable";
import TagDropDownList from "../tagDropDownList/tagDropDownList";
import StatusDropDownList from "../statusDropDownList/StatusDropDownList";
import Loader from "../loader/Loader";

const SupplyTable = observer(({ configName, showPage }) => {
  const { id } = useParams();
  const [currentConfig, setCurrentConfig] = useState(null);
  const { party, getParties, getPartyById, deletePartyFile, uploadPartyFile, createParty, patchParty, isLoading } = PartyStore;
  const { currentUser, getCurrentUser } = UserStore;
  const [currentParty, setCurrentParty] = useState({});
  const [products, setProducts] = useState({});
  const [partyFiles, setPartyFiles] = useState([]);
  const [isShowProductTable, setIsShowProductTable] = useState(false)
  const [partyModifications, setPartyModifications] = useState([]);
  const [showColumnList, setShowColumnList] = useState(false);
  const columnsListBtnRef = useRef(null);
  const columnsListRef = useRef(null);
  const {
    errorText,
    successText,
    setErrorText,
    setSuccessText,
    resetErrorText,
    resetSuccessText,
  } = NotificationStore;
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
    "стоимость партии",
  ];
  const [selectedPartiesColumns, setSelectedPartiesColumns] = useState([
    "наименование",
    "принято",
    "остаток",
    "себестоимость вещи",
    "цена продажи",
    "себестоимость партии",
    "стоимость партии",
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
        // console.log(toJS(row))
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
        // console.log(products)
        // console.log(toJS(row))
        return (
          <div
            data-tooltip-id="supply-party-name-tooltip"
            data-tooltip-content={products[row.modification.id]?.displayName}
            className="supply-party-column__container"
          >
            {products[row.modification.id]?.displayName}
          </div>
        );
      },
    },
    принято: {
      className: "supply-party-column",
      content: (row, rowIndex) => {
        // console.log(currentParty)
        // console.log(row)
        return (
          <div className="supply-party-column__container">
            <input
              type="text"
              className="supplyTable__conterAgent-input"
              value={currentParty.modifications_in_party[rowIndex]?.amount}
              onChange={(e) => {
                const newAmount = Number(e.target.value);
                setCurrentParty((prev) => {
                  const newModifications = [...prev.modifications_in_party];
                  newModifications[rowIndex] = {
                    ...newModifications[rowIndex],
                    amount: newAmount,
                  };
                  return {
                    ...prev,
                    modifications_in_party: newModifications,
                  };
                });
              }}
            />
          </div>
        );
      },
    },
    остаток: {
      className: "supply-party-column",
      content: (row) => {
        return (
          row.modification.remaining != null && (
            <div className="supply-party-column__container">
              {row.modification.remaining}
            </div>
          )
        );
      },
    },
    "себестоимость вещи": {
      className: "supply-party-column",
      content: (row) => {
        return (
          <div className="supply-party-column__container">
            {products[row.modification.id]?.cost_price}
          </div>
        );
      },
    },
    "цена продажи": {
      className: "supply-party-column",
      content: (row) => {
        return (
          <div className="supply-party-column__container">
            {products[row.modification.id]?.price}
          </div>
        );
      },
    },
    "себестоимость партии": {
      className: "supply-party-column",
      content: (row, rowIndex) => {
        return (
          <div className="supply-party-column__container">
            {currentParty.modifications_in_party[rowIndex]?.amount * products[row.modification.id]?.cost_price}
          </div>
        );
      },
    },
    "стоимость партии": {
      className: "supply-party-column",
      content: (row, rowIndex) => {
        return (
          <div className="supply-party-column__container">
            {currentParty.modifications_in_party[rowIndex]?.amount * products[row.modification.id]?.price}
          </div>
        );
      },
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      getPartyById(id);
    } else {
      setCurrentParty({
        'agent_name': "",
        'status': "на складе",
        'tag': "",
        'note': "",
        'storage': "",
        'project': "",
        'phone_number': "",
        'modifications_in_party': [],
        'overheads': 0,
      });
    }
    getCurrentUser();
    fetchProducts(false);
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      setCurrentParty(party);
      if (party && party.files) {
        setPartyFiles(party.files);
      }
      if (party && party.modifications_in_party) {
        setPartyModifications(party.modifications_in_party);
      }
    }
  }, [party]);

  // useEffect(() => {
  //   console.log(toJS(currentParty))
  // }, [currentParty])

  async function fetchProducts(isArchived) {
    try {
      const response = await getProducts(isArchived);
      const newProducts = response.data.reduce((acc, row) => {
        row.modifications.forEach((modification) => {
          acc[modification.id] = {
            displayName: `${row.name} (${modification.size})`,
            ...row,
          };
        });
        return acc;
      }, {});
      setProducts(newProducts);
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail);
    }
  }

  const totalCostPrice = useMemo(() => {
    return partyModifications.reduce((total, modification) => {
      const product = products[modification.modification.id];
      return total + (product?.cost_price || 0) * modification.amount;
    }, 0);
  }, [partyModifications, products]);

  const totalCost = useMemo(() => {
    return partyModifications.reduce((total, modification) => {
      const product = products[modification.modification.id];
      return total + (product?.price || 0) * modification.amount;
    }, 0);
  }, [partyModifications, products]);

  // useEffect(() => {
  //   console.log(products);
  // }, [products]);

  const removeFile = async (fileId) => {
    try {
      if (id != undefined) {
        await deletePartyFile(fileId);
      }
      setPartyFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      );
      setSuccessText("Файл удалён")
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail);
    }
  };

  const handleClick = () => fileInputRef.current.click();

  const uploadFiles = (files, id) =>
    files.map(async (file) => {
      // console.log(file)
      try {
        const response = await uploadPartyFile(id, file);
        setPartyFiles((prevFiles) => [...prevFiles, response.data]);
        setSuccessText('Файл загружен')
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
    // console.log(value, field);
    setCurrentParty((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    console.log(toJS(currentParty))
  }, [currentParty])

  const handleUpdate = (value, field) => {
    if (id == undefined) return;
    console.log(value, field);
    try {
      patchParty(id, { [field]: value });
      setSuccessText('Изменения сохранены');
    } catch (e) {
      console.error(e);
      setErrorText(e?.response?.data?.detail);
    }
  };

  const handleColumnSelect = (column) => {
    if (selectedPartiesColumns.includes(column)) {
      setSelectedPartiesColumns(
        selectedPartiesColumns.filter((col) => col !== column)
      );
    } else {
      let inserted = false;
      const newSelectedColumns = selectedPartiesColumns.reduce(
        (acc, selectedColumn) => {
          if (
            columnPartiesHeaders.indexOf(column) <
              columnPartiesHeaders.indexOf(selectedColumn) &&
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

  const isImportantFieldsFilled = (currentSupply) => {
    const newFieldValidity = {
      agent_name: currentSupply.agent_name !== '',
      phone_number: currentSupply.phone_number !== '',
      modifications_in_party: currentSupply.modifications_in_party.length !== 0,
    };
    return Object.values(newFieldValidity).every(isValid => isValid);
  }

  const createNewParty = async() => {
    if (!isImportantFieldsFilled(currentParty)) {
      setErrorText('Заполните необходимые поля!');
      return;
    }

    const resp = await createParty(currentParty)
    uploadFiles(partyFiles, resp.data.id);
    getParties()
    showPage(false)
    setSuccessText("Новая партия создана");
  };

  useEffect(() => {
    if (id === undefined) {
      const newModifications = partyModifications.map((modification) => ({
        amount: 1,
        modification: {
          size: modification.modification.size,
          article: modification.modification.article,
          remaining: modification.modification.remaining,
          id: modification.modification.id,
          product_id: modification.modification.product_id,
        },
        modification_id: modification.modification.id
      }));
  
      // console.log(newModifications);
  
      setCurrentParty((prev) => ({
        ...prev,
        modifications_in_party: [...prev?.modifications_in_party, ...newModifications],
      }));
    }
  }, [partyModifications]);

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
    return partyModifications?.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {columnPartiesHeaders.map((column, colIndex) => {
          const className = columnPartiesConfig[column]?.className;
          // console.log(toJS(row))
          return (
            <td key={colIndex} className={className}>
              {columnPartiesConfig[column]?.content(row, rowIndex)}
            </td>
          );
        })}
      </tr>
    ));
  };

  if (isLoading) {
    return (<Loader />)
  }

  return (
    <div
      className={`${id !== undefined ? "supplyTable-page" : "supplyTable-new"}`}
    >
      <div className="supplyTable__header">
        {id !== undefined ? (
          <div className="back-btn">
            <Link to={"/parties"}>
              <button className="back-btn__btn">
                <div className="back-btn__arrow"></div>
              </button>
            </Link>
          </div>
        ) : (
          <button
            onClick={() => createNewParty()}
            className="supplyTable__saveBtn"
          >
            Сохранить
          </button>
        )}
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
            <div
              className={`supplyTable__content-item ${
                currentParty.agent_name === "" ? "warning" : ""
              }`}
            >
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
          <div
            className={`supplyTable__content-item ${
              currentParty.phone_number === "" ? "warning" : ""
            }`}
          >
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
            {/* <StatusDropDownList
              selectedItem={currentParty.status}
              changeFunc={handleChange}
              updateFunc={handleUpdate}
            /> */}
          </div>
          <div className="supplyTable__content-item">
            <p className="supplyTable__conterAgent-text">Тег</p>
            {/* <TagDropDownList
              selectedItem={currentParty.tag}
              changeFunc={handleChange}
              updateFunc={handleUpdate}
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
      <div
        className={`${
          // id !== undefined
          //   ? "supplyTable__productTableBtn-addnone"
            // : 
            "supplyTable__productTableBtn"
        }`}
      >
        <button
          className="supplyTable__productTableBtn-add"
          onClick={() => {
            setIsShowProductTable(true);
          }}
        >
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
              <div key={index} className="warehouse-table__settings-container">
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
      {isShowProductTable && (
        <ProductTable
          showComponent={setIsShowProductTable}
          configName="addProductConfig"
          addedProducts={setPartyModifications}
        />
      )}
      <table
        className={`${
          id !== undefined
            ? "supplyTable-products-table-page"
            : "supplyTable-products-table-new"
        }`}
      >
        <thead className="supplyTable__table-header">
          <tr>{renderPartiesHeaders()}</tr>
        </thead>
        <tbody className="supplyTable__table-body">
          {partyModifications && renderPartiesRows()}
        </tbody>
      </table>
      <div className="supplyTable__expenses">
        {`Накладные расходы`}
        <input
          type="text"
          className="supplyTable__expenses-input"
          value={currentParty.overheads}
          onChange={(e) => handleChange(e.target.value, "overheads")}
          onBlur={(e) => handleUpdate(e.target.value, "overheads")}
        />
      </div>
      <div className="supplyTable__total">
        <p className="supplyTable__total-costprice">
          {`Общая себестоимость ${totalCostPrice}`}
        </p>
        <p className="supplyTable__total-cost">{`Общая стоимость ${totalCost}`}</p>
      </div>
      <Tooltip id="supply-party-name-tooltip" />
      {id !== undefined && (
        <>
          {errorText && (
            <NotificationManager
              errorMessage={errorText}
              resetFunc={resetErrorText}
            />
          )}
          {successText && (
            <NotificationManager
              successMessage={successText}
              resetFunc={resetSuccessText}
            />
          )}
        </>
      )}
    </div>
  );
});

export default SupplyTable;
