import React, { useState, useEffect, useRef, Fragment } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";
import "./OrderData.css";
import DropDownList from "../../../../../dropDownList/DropDownList";
import {
  createOrder,
  getOrderById,
  patchOrder,
  uploadOrderFile,
  deleteOrderFile
} from "../../../../../../API/ordersAPI";
import { getProducts } from "../../../../../../API/productsApi";
import { Tooltip } from "react-tooltip";
import settings from "../../../../../../assets/img/table-settings.svg";
import InputMask from "react-input-mask";
import { formatDateTime } from "../../../../../../API/formateDateTime";
import close from "../../../../../../assets/img/close_filter.png";
import NotificationManager from "../../../../../notificationManager/NotificationManager";
import NotificationStore from "../../../../../../NotificationStore";
import { observer } from "mobx-react-lite";
import ProductTable from "../../../productTable/ProductTable";
import UserStore from "../../../../../../UserStore";
import download from "../../../../../../assets/img/product_file_download.png";
import StatusDropDownList from "../../../../../statusDropDownList/StatusDropDownList";
import TagDropDownList from "../../../../../tagDropDownList/tagDropDownList";
import getImgName from '../../../../../../API/getImgName'

const OrderData = observer(({ configName, showNewOrder }) => {
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState();
  const { currentUser, getCurrentUser } = UserStore;
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedFiles, setSelectedFiles] = useState([[], []]);
  // const [statusObj, setStatusObj] = useState({});
  // const [tagObj, setTagObj] = useState({});
  // const fileInputRef = useRef(null);
  // const [localPhone, setLocalPhone] = useState('')
  const phoneInputRef = useRef(null);
  const [isShowProductTable, setIsShowProductTable] = useState(false);
  const [unformateDate, setUnformateDate] = useState("");
  const [products, setProducts] = useState({});
  const [ordersModifications, setOrdersModifications] = useState([]);
  const [ordersFiles, setOrdersFiles] = useState([]);
  // let {ordersDate, setOrdersDate} = useOutletContext();
  const columns = ["Товары", "Количество", "Остаток", "Цена", "Сумма"];
  const dropdowndRef = useRef(null);
  const [selectedColumns, setSelectedColumns] = useState([
    "Товары",
    "Количество",
    "Остаток",
    "Цена",
    "Сумма",
  ]);
  const columnFilesHeaders = [
    "название",
    "размер",
    "дата",
    "сотрудник",
    "с",
    "x",
  ];
  const [showColumnList, setShowColumnList] = useState(false);

  const columnsListRef = useRef(null);

  const [currentConfig, setCurrentConfig] = useState(null);

  const fileInputRef = useRef(null);

  const {
    errorText,
    successText,
    setErrorText,
    setSuccessText,
    resetErrorText,
    resetSuccessText,
  } = NotificationStore;

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

  useEffect(() => {
    setCurrentConfig(returnConfig(configName));
    // console.log(configName)
  }, [configName]);

  const returnConfig = (configName) => {
    switch (configName) {
      case "newOrderConfig":
        return {
          isShowLink: false,
          isShowMessage: false,
          isShowFiles: false,
          isShowHeaderBtn: true,
          newDropDownList: true,
          wrapperClassName: "orderData-new",
          orderDataHeaderClassName: "orderData__header-new",
          orderDataInfoHeaderClassName: "orderDataInfo__header-new",
          startFunc: () => {
            setOrderInfo({
              full_name: "",
              status: "в обработке",
              tag: "",
              channel: "",
              address: "",
              task: "",
              note: "",
              comment: "",
              storage: "",
              project: "",
              phone_number: "",
              email: "",
              modifications_in_order: [],
            });
          },
        };
      case "orderPageConfig":
        return {
          isShowLink: true,
          isShowMessage: true,
          isShowFiles: true,
          isShowHeaderBtn: false,
          wrapperClassName: "orderDate-page",
          orderDataHeaderClassName: "orderData__header-page",
          orderDataInfoHeaderClassName: "orderDataInfo__header-page",
          startFunc: getOrderData,
        };
      default:
        return null;
    }
  };

  const getOrderData = async () => {
    try {
      const response = await getOrderById(id);
      setOrderInfo(response.data);
      // console.log(response.data);
      // setUnformateDate(response.data.order_date);
      // setOrdersDate(formatDateTime(response.data.order_date));
      // console.log(ordersDate)
      setOrdersModifications(response.data.modifications_in_order);
      setOrdersFiles(response.data.files)
    } catch (error) {
      setIsLoading(true);
      setErrorText(error.response.data.detail);
    }
  };

  const removeFile = async(fileId) => {
    try {
      if (id != undefined) {
        await deleteOrderFile(fileId);
      }
      setOrdersFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      );
      setSuccessText('Файл удалён')
    } catch (e) {
      console.error(e);
      setErrorText(e.response.data.detail)
    }
  }

  // useEffect(() => {
  //   console.log(ordersModifications);
  // }, [ordersModifications]);

  useEffect(() => {
    currentConfig?.startFunc();
  }, [currentConfig, id]);

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

  useEffect(() => {
    if (orderInfo) {
      setIsLoading(false);
    }
  }, [orderInfo]);

  useEffect(() => {
    fetchProducts(false);
    if (id == undefined) {
      getCurrentUser()
    }
  }, []);

  const handleChange = (e, field) => {
    
    if (e.target !== undefined) {
      setOrderInfo((prev) => ({ ...prev, [field]: e.target.value }));
    } else {
      console.log(e, field);
      setOrderInfo((prev) => ({ ...prev, [field]: e }));
      updateOrderInfo(field, e);
    }

    // console.log(value, field);
    // setOrderInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = (e, field) => {
    const value = e.target.value;
    updateOrderInfo(field, value);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);

    if (id == undefined) {
      files.forEach((file) => {
        setOrdersFiles((prevFiles) => [...prevFiles, file]);
      });
      return;
    }

    uploadFiles(files, id);
  };

  const uploadFiles = (files, id) =>
    files.map(async (file) => {
      // console.log(file)
      try {
        const response = await uploadOrderFile(id, file);
        console.log(response.data)
        setOrdersFiles((prevFiles) => [...prevFiles, response.data]);
        setSuccessText('Файл добавлен')
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
        setErrorText(error.response.data.detail);
      }
    });

  const handleClick = () => fileInputRef.current.click();

  const updateOrderInfo = async (key, value) => {
    try {
      await patchOrder(id, key, value);
      setSuccessText("Значение успешно изменено!");
    } catch (error) {
      console.error(error);
      setErrorText(error.response.data.detail);
    }
  };

  const handleColumnSelect = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
    } else {
      let inserted = false;
      const newSelectedColumns = selectedColumns.reduce(
        (acc, selectedColumn) => {
          if (
            columns.indexOf(column) < columns.indexOf(selectedColumn) &&
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

      setSelectedColumns(newSelectedColumns);
    }
  };

  const renderImgContent = () => {
    if (productsImages && productsImages.length > 0) {
      return renderImg(productsImages);
    } else {
      return renderImgDragAndDrop();
    }
  };

  const handleAddSelectedItems = (newItems) => {
    const uniqueNewObjects = newItems.filter(newObj => 
      !ordersModifications.some(existingObj => existingObj.modification.id === newObj.modification.id)
    );
    setOrdersModifications((prev) => [...prev, ...uniqueNewObjects])
  }

  const columnConfig = {
    Товары: {
      className: "orderdata-column orderdata-name",
      content: (row) => {
        return (
          <div className="orderdata-column-wrapper">
            <button
              className="orderdata-column__close-btn"
              onClick={() => removeModification(row.modification.id)}
            >
              <img
                src={close}
                alt="close btn"
                className="orderdata-column__close-img"
              />
            </button>
            <div className="orderdata-column-container">
              {products[row.modification.id]?.displayName}
            </div>
          </div>
        );
      },
    },
    Количество: {
      className: "orderdata-column orderdata-quantity",
      content: (row) => {
        // return (
        //   <div className="orderdata-column-container">{row.name}</div>
        // );
      },
    },
    Остаток: {
      className: "orderdata-column orderdata-remains",
      content: (row) => {
        return (
          <div className="orderdata-column-container">
            {row.modification.remaining}
          </div>
        );
      },
    },
    Цена: {
      className: "orderdata-column orderdata-remains",
      content: (row) => {
        return (
          <div className="orderdata-column-container">
            {products[row.modification.id]?.price + " ₽"}
          </div>
        );
      },
    },
    Сумма: {
      className: "orderdata-column orderdata-remains",
      content: (row) => {
        // return row.price ? (
        //   <div className="orderdata-column-container">{row.price + ' ₽'}</div>
        // ) : null;
      },
    },
  };

  const totalInfoConfig = {
    Товары: {
      className: "orderdata-total-column orderdata-name",
    },
    Количество: {
      className: "orderdata-total-column orderdata-quantity",
    },
    Остаток: {
      className: "orderdata-total-column orderdata-remains",
    },
    Цена: {
      className: "orderdata-total-column orderdata-remains",
    },
    Сумма: {
      className: "orderdata-total-column orderdata-remains",
    },
  };

  // добавить patch
  const removeModification = (id) => {
    const updatedModifications = ordersModifications.filter((obj) => obj.modification.id !== id);
    setOrdersModifications(updatedModifications);
  };

  const renderFileHeaders = () => {
    return columnFilesHeaders.map((column, index) => (
      <th key={index} className="supply-file-column-header">
        {column}
      </th>
    ));
  };

  const renderFileRows = () => {
    return ordersFiles.map((row, rowIndex) => (
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

  const renderHeaders = () => {
    return selectedColumns.map((column, index) => (
      <th key={index} className="orderdata-column-header">
        {column}
      </th>
    ));
  };

  const renderRows = () => {
    return ordersModifications?.map((row, rowIndex) => (
      <Fragment key={rowIndex}>
        <tr className="orderdata-column-tr">
          {selectedColumns.map((column, colIndex) => {
            const className = columnConfig[column]?.className;
            return (
              <td key={colIndex} className={className}>
                {columnConfig[column]?.content(row)}
              </td>
            );
          })}
        </tr>
        {/* {rowIndex === ordersModifications.length - 1 && (
          <div className="orderData__table__add">
            <span
              className="orderData__table__add-btn"
              onClick={() => {
                setIsShowProductTable(true);
              }}
            ></span>
          </div>
        )} */}
      </Fragment>
    ));
  };

  const renderTotalInfoRow = () => {
    const totalAmount = ordersModifications?.reduce(
      (sum, row) => sum + row.amount,
      0
    );
    const totalRemaining = ordersModifications?.reduce(
      (sum, row) => sum + row.modification.remaining,
      0
    );
    const totalPrice = ordersModifications?.reduce(
      (sum, row) => sum + (products[row.modification.id]?.price || 0),
      0
    );
    const totalSum = ordersModifications?.reduce(
      (sum, row) =>
        sum + row.amount * (products[row.modification.id]?.price || 0),
      0
    );

    return (
      <tr>
        {selectedColumns.map((column, colIndex) => {
          const className = totalInfoConfig[column]?.className;
          let content;
          switch (column) {
            case "Товары":
              content = "Общие данные";
              break;
            case "Количество":
              // content = totalAmount;
              break;
            case "Остаток":
              content = totalRemaining;
              break;
            case "Цена":
              content = totalPrice + " ₽";
              break;
            case "Сумма":
              // content = totalSum + " ₽";
              break;
            default:
              content = "";
          }
          return (
            <td key={colIndex} className={className}>
              {content}
            </td>
          );
        })}
      </tr>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${currentConfig?.wrapperClassName}`}>
      <div className={`${currentConfig?.orderDataHeaderClassName}`}>
        {currentConfig?.isShowLink && (
          <div className="orderData__navBar">
            <Link
              className="orderData__navBar-link"
              to={`/orders/${id}/orderdata`}
            >
              Данные заказа
            </Link>
            <Link className="orderData__navBar-link">Доставка</Link>
            <Link className="orderData__navBar-link">
              Выставить счет для оплаты
            </Link>
          </div>
        )}
        {currentConfig?.isShowHeaderBtn && (
          <div className="orderData__header-btn">
            <div className="c-btn">
              <button
                className="product__save-btn-button"
                onClick={() => {
                  createNewProduct(currentProduct);
                }}
              >
                Сохранить
              </button>
            </div>
            <div className="product__content-close">
              <button
                className="product__content-close-btn"
                onClick={() => showNewOrder(false)}
              >
                <img
                  src={close}
                  alt="close product__content"
                  className="product__content-close-img"
                />
              </button>
            </div>
          </div>
        )}
        <div className="orderData__header-data">
          <StatusDropDownList selectedItem={orderInfo.status} changeFunc={handleChange}/>
          <TagDropDownList selectedItem={orderInfo.tag} changeFunc={handleChange}/>
          {/* <DropDownList
            statusList={true}
            startItem={currentConfig.newDropDownList ? "статус заказа" : orderInfo.status}
            // rowId={orderInfo.id}
            statusObj={id ? null : handleStatusObj}
            currentPage="orders"
          />
          <DropDownList
            statusList={false}
            isItemLink={false}
            startItem={
              currentConfig.newDropDownList ? "тег" : (orderInfo.tag === null ? "нет" : orderInfo.tag)
            }
            items={["бартер", "нет"]}
            tagClass={true}
            // rowId={orderInfo.id}
            tagObj={id ? null : handleTagObj}
            currentPage="orders"
          /> */}
        </div>
        {currentConfig?.isShowLink && (
          <div className="orderData__header-settings">
            <button className="OrderData__settings-btn">
              <img src={settings} alt="settings" />
            </button>
          </div>
        )}
      </div>
      <div className="orderDataInfo">
        <div
          className={`orderDataInfo__personalInfo ${
            orderInfo.full_name === "" ? "warning" : ""
          }`}
        >
          <div className={`${currentConfig.orderDataInfoHeaderClassName}`}>
            {currentConfig?.isShowHeaderBtn && (
              <p
                className={`orderDataInfo_fullName-text ${
                  // orderInfo.email != ""
                  // ? "orderDataInfo-text-content"
                  // :
                  "orderDataInfo-text"
                }`}
              >
                ФИО покупателя
              </p>
            )}
            <div className={`orderDataInfo__fullName orderDataInfo-item`}>
              <input
                className="orderDataInfo__input"
                value={orderInfo.full_name || ""}
                onChange={(e) => handleChange(e, "full_name")}
                onBlur={(e) => handleUpdate(e, "full_name")}
              />
            </div>
            {currentConfig?.isShowMessage && (
              <Link className="orderDataInfo__message orderDataInfo-item">
                Сообщения
              </Link>
            )}
          </div>
          <div
            className={`orderDataInfo__email ${
              orderInfo.email === "" ? "warning" : ""
            }`}
          >
            <p
              className={`orderDataInfo__email-text ${
                // orderInfo.email != ""
                // ? "orderDataInfo-text-content"
                // :
                "orderDataInfo-text"
              }`}
            >
              Email
            </p>
            <div
              className={`orderDataInfo__email-content ${
                // orderInfo.email != ""
                // ? "orderDataInfo-item-content"
                // :
                "orderDataInfo-item"
              }`}
            >
              <input
                className="orderDataInfo__input"
                value={orderInfo.email || ""}
                onChange={(e) => handleChange(e, "email")}
                onBlur={(e) => handleUpdate(e, "email")}
              />
            </div>
          </div>
          <div
            className={`orderDataInfo__tel ${
              orderInfo.phone_number === "" ? "warning" : ""
            }`}
          >
            <p className="orderDataInfo__tel-text orderDataInfo-text">
              Телефон
            </p>
            <div className="orderDataInfo__tel-content orderDataInfo-item">
              <InputMask
                mask="+7 (999) 999-99-99"
                value={orderInfo.phone_number}
                onChange={(e) => handleChange(e, "phone_number")}
                onBlur={(e) => handleUpdate(e, "phone_number")}
                className="orderDataInfo__input"
                ref={phoneInputRef}
              />
            </div>
          </div>
        </div>
        <div className="orderDataInfo__geo">
          <div className="orderDataInfo__geo-minicol">
            <div className="orderDataInfo__channel">
              <p className="orderDataInfo__channel-text orderDataInfo-text">
                Канал продаж
              </p>
              <div className="orderDataInfo__channel-content orderDataInfo-item">
                <input
                  className="orderDataInfo__input"
                  value={orderInfo.channel || ""}
                  onChange={(e) => handleChange(e, "channel")}
                  onBlur={(e) => handleUpdate(e, "channel")}
                />
              </div>
            </div>
            <div className="orderDataInfo__storage">
              <p className="orderDataInfo__storage-text orderDataInfo-text">
                Склад
              </p>
              <div className="orderDataInfo__storage-content orderDataInfo-item">
                <input
                  className="orderDataInfo__input"
                  value={orderInfo.storage || ""}
                  onChange={(e) => handleChange(e, "storage")}
                  onBlur={(e) => handleUpdate(e, "storage")}
                />
              </div>
            </div>
            <div className="orderDataInfo__project">
              <p className="orderDataInfo__project-text orderDataInfo-text">
                Проект
              </p>
              <div className="orderDataInfo__project-content orderDataInfo-item">
                <input
                  className="orderDataInfo__input"
                  value={orderInfo.project || ""}
                  onChange={(e) => handleChange(e, "project")}
                  onBlur={(e) => handleUpdate(e, "project")}
                />
              </div>
            </div>
          </div>
          <div className="orderDataInfo__geo-bigcol">
            <div className="orderDataInfo__address">
              <p className="orderDataInfo__address-text orderDataInfo-text">
                Адрес доставки
              </p>
              <div className="orderDataInfo__address-content orderDataInfo-item">
                <textarea
                  className="orderDataInfo__input orderDataInfo__input-area"
                  value={orderInfo.address || ""}
                  onChange={(e) => handleChange(e, "address")}
                  onBlur={(e) => handleUpdate(e, "address")}
                />
              </div>
            </div>
            <div className="orderDataInfo__writing">
              <div className="orderDataInfo__comment">
                <p className="orderDataInfo__comment-text orderDataInfo-text">
                  Комментарий
                </p>
                <div className="orderDataInfo__comment-content orderDataInfo-item">
                  <textarea
                    className="orderDataInfo__input orderDataInfo__input-area"
                    value={orderInfo.comment || ""}
                    onChange={(e) => handleChange(e, "comment")}
                    onBlur={(e) => handleUpdate(e, "comment")}
                  />
                </div>
              </div>
              <div className="orderDataInfo__note">
                <p className="orderDataInfo__note-text orderDataInfo-text">
                  Заметка
                </p>
                <div className="orderDataInfo__note-content orderDataInfo-item">
                  <textarea
                    className="orderDataInfo__input orderDataInfo__input-area"
                    value={orderInfo.note || ""}
                    onChange={(e) => handleChange(e, "note")}
                    onBlur={(e) => handleUpdate(e, "note")}
                  />
                </div>
              </div>
            </div>
          </div>
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
        {currentConfig.isShowFiles && (
          <div className="orderDataInfo__files"></div>
        )}
      </div>
      <div className="orderData__tableSettins">
        <div className="orderData__tableSettins-wrapper">
          <button
            className="supplyTable__productTableBtn-add"
            onClick={() => {
              setIsShowProductTable(true);
            }}
          >
            Добавить товар
          </button>
          <div className="orderData__promoCode">
            <p className="orderData__promoCode-text">Промокод</p>
            <input type="text" className="orderData__promoCode-input" />
          </div>
          <div className="orderData__discount">
            <p className="orderData__discount-text">Скидка</p>
            <input type="text" className="orderData__discount-input" />
          </div>
        </div>
        <button
          className="OrderData__tableSettins-btn"
          onClick={() => {
            setShowColumnList(!showColumnList);
          }}
        >
          <img src={settings} alt="settings" />
        </button>
      </div>
      {showColumnList && (
        <div className="warehouse-table__settings" ref={columnsListRef}>
          {columns.map((column, index) => (
            <div key={index} className="warehouse-table__settings-container">
              <label className="warehouse-table__settings-item">
                <div className="warehouse-table__settings-content">
                  {column}
                </div>
                <div className="warehouse-table__settings-input">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={() => handleColumnSelect(column)}
                  />
                  <span className="checkbox-custom"></span>
                </div>
              </label>
            </div>
          ))}
        </div>
      )}
      <div className="orderData__table">
        <table className="orderData__table-table">
          <thead>
            <tr>{renderHeaders()}</tr>
          </thead>
          <tbody className="orderData__table-tbody">{renderRows()}</tbody>
          {renderTotalInfoRow()}
        </table>
      </div>
      {isShowProductTable && (
        <ProductTable
          showComponent={setIsShowProductTable}
          configName="addProductConfig"
          addedProducts={handleAddSelectedItems}
        />
      )}
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
    </div>
  );
});

export default OrderData;
