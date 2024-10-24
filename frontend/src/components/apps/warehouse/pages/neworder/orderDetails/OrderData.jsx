import React, { useState, useEffect, useRef } from "react";
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
} from "../../../../../../API/ordersAPI";
import settings from "../../../../../../assets/img/table-settings.svg";
import InputMask from "react-input-mask";
import { formatDateTime } from "../../../../../../API/formateDateTime";
import close from "../../../../../../assets/img/close_filter.png";
import NotificationManager from "../../../../../notificationManager/NotificationManager";
import NotificationStore from "../../../../../../NotificationStore";
import { observer } from 'mobx-react-lite';


const OrderData = observer(({configName, showNewOrder}) => {
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([[], []]);
  const [statusObj, setStatusObj] = useState({});
  const [tagObj, setTagObj] = useState({});
  // const [localPhone, setLocalPhone] = useState('')
  const phoneInputRef = useRef(null);
  const [unformateDate, setUnformateDate] = useState("");
  const [ordersProducts, setOrdersProducts] = useState([]);
  // let {ordersDate, setOrdersDate} = useOutletContext();
  const columns = [
    "Товары",
    "Количество",
    "Остаток",
    "Цена",
    "Стоимость доставки",
    "НДС",
    "Скидка",
    "Промокод",
    "Сумма",
  ];
  const [selectedColumns, setSelectedColumns] = useState([
    "Товары",
    "Количество",
    "Остаток",
    "Цена",
    "Стоимость доставки",
    "НДС",
    "Скидка",
    "Промокод",
    "Сумма",
  ]);
  const [showColumnList, setShowColumnList] = useState(false);

  const columnsListRef = useRef(null);

  const [currentConfig, setCurrentConfig] = useState(null);

  const { errorText, successText, setErrorText, setSuccessText, resetErrorText, resetSuccessText } = NotificationStore;

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
          orderDataHeaderClassName: 'orderData__header-new',
          orderDataInfoHeaderClassName: 'orderDataInfo__header-new',
          startFunc: () => {
            setOrderInfo({
              "full_name": "",
              "status": "в обработке",
              "tag": "",
              "channel": "",
              "address": "",
              "task": "",
              "note": "",
              "comment": "",
              "storage": "",
              "project": "",
              "phone_number": "",
              "email": "",
              "products_in_order": []
            })
          }
        };
      case "orderPageConfig":
        return {
          isShowLink: true,
          isShowMessage: true,
          isShowFiles: true,
          isShowHeaderBtn: false,
          wrapperClassName: "orderDate-page",
          orderDataHeaderClassName: 'orderData__header-page',
          orderDataInfoHeaderClassName: 'orderDataInfo__header-page',
          startFunc: getOrderData
        };
      default:
        return null;
    }
  };

  const getOrderData = async () => {
    try {
      const response = await getOrderById(id);
      setOrderInfo(response.data);
      // setUnformateDate(response.data.order_date);
      // setOrdersDate(formatDateTime(response.data.order_date));
      // console.log(ordersDate)
      setOrdersProducts(response.data.products_in_order);
    } catch (error) {
      setIsLoading(true);
      setErrorText(error.response.data.detail)
    }
  };

  // useEffect(() => {
  //   console.log(ordersProducts)
  // }, [ordersProducts])

  useEffect(() => {
    currentConfig?.startFunc();
  }, [currentConfig, id]);

  useEffect(() => {
    if (orderInfo) {
      setIsLoading(false);
    }
  }, [orderInfo])

  const handleChange = (e, field) => {
    const value = e.target.value;
    setOrderInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = (e, field) => {
    const value = e.target.value;
    updateOrderInfo(field, value);
  }

  const handleFileChange = (e, index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = Array.from(e.target.files);
    setSelectedFiles(newSelectedFiles);
  };

  const updateOrderInfo = async (key, value) => {
    try {
      await patchOrder(id, key, value);
      setSuccessText("Значение успешно изменено!")
    } catch (error) {
      console.error(error);
      setErrorText(error.response.data.detail)
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

  // const columnConfig = {
  //   товары: {
  //     className: "orderdata-column orderdata-name",
  //     content: (row) => {
  //       return row.name ? (
  //         <div className="orderdata-column-container">{row.name}</div>
  //       ) : null;
  //     },
  //   },
  //   // количество: {
  //   //   className: "orderdata-column orderdata-quantity",
  //   //   content: (row) => {
  //   //     return row.name ? (
  //   //       <div className="orderdata-column-container">{row.name}</div>
  //   //     ) : null;
  //   //   },
  //   // },
  //   остаток: {
  //     className: "orderdata-column orderdata-remains",
  //     content: (row) => {
  //       return row.remaining ? (
  //         <div className="orderdata-column-container">{row.remaining + ' ' + row.measure}</div>
  //       ) : null;
  //     },
  //   },
  //   цена: {
  //     className: "orderdata-column orderdata-remains",
  //     content: (row) => {
  //       return row.price ? (
  //         <div className="orderdata-column-container">{row.price + ' ₽'}</div>
  //       ) : null;
  //     },
  //   },
  //   'стоимость доставки': {
  //     className: "orderdata-column orderdata-remains",
  //     content: (row) => {
  //       return row.price ? (
  //         <div className="orderdata-column-container">{row.price + ' ₽'}</div>
  //       ) : null;
  //     },
  //   },
  // }

  const renderHeaders = () => {
    return selectedColumns.map((column, index) => (
      <th key={index} className="orderdata-column-header">
        {column}
      </th>
    ));
  };

  const renderRows = () => {
    return filteredProducts.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {selectedColumns.map((column, colIndex) => {
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
        <div className="orderDataInfo__personalInfo">
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
          <div className="orderDataInfo__email">
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
          <div className="orderDataInfo__tel">
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
        </div>
        {currentConfig.isShowFiles && (
          <div className="orderDataInfo__files"></div>
        )}
      </div>
      <div className="orderData__tableSettins">
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
      <table className="orderData__table">
        <thead>
          <tr>{renderHeaders()}</tr>
        </thead>
        {/* <tbody>{renderRows()}</tbody> */}
      </table>
      {errorText && <NotificationManager errorMessage={errorText} resetFunc={resetErrorText}/>}
      {successText && <NotificationManager successMessage={successText} resetFunc={resetSuccessText} />}
    </div>
  );
});

export default OrderData;
