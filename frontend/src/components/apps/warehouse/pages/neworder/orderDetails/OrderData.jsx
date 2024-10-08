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

const OrderData = () => {
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([[], []]);
  // const [statusObj, setStatusObj] = useState({});
  // const [tagObj, setTagObj] = useState({});
  // const [localPhone, setLocalPhone] = useState('')
  const navigate = useNavigate();
  const phoneInputRef = useRef(null);
  const { ordersDate, setOrdersDate } = useOutletContext();
  const [unformateDate, setUnformateDate] = useState("");
  const [ordersProducts, setOrdersProducts] = useState([]);
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

  const getOrderData = async (id) => {
    try {
      const response = await getOrderById(id);
      setOrderInfo(response.data);
      setIsLoading(false);
      // setUnformateDate(response.data.order_date);
      setOrdersDate(formatDateTime(response.data.order_date));
      setOrdersProducts(response.data.products_in_order);
    } catch (error) {
      setIsLoading(true);
    }
  };

  // useEffect(() => {
  //   console.log(ordersProducts);
  // }, [ordersProducts])

  useEffect(() => {
    if (id !== undefined) {
      getOrderData(id);
    } else {
      setIsLoading(false);
    }
  }, [id]);

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
    } catch (error) {
      console.error(error);
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
    <>
      <div className="orderData__header">
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
        <div className="orderData__header-data">
          <DropDownList
            statusList={true}
            startItem={id ? orderInfo.status : "статус заказа"}
            rowId={orderInfo.id}
            // statusObj={id ? null : handleStatusObj}
            currentPage="orders"
          />
          <DropDownList
            statusList={false}
            isItemLink={false}
            startItem={
              id ? (orderInfo.tag === null ? "нет" : orderInfo.tag) : "тег"
            }
            items={["бартер", "нет"]}
            tagClass={true}
            rowId={orderInfo.id}
            // tagObj={id ? null : handleTagObj}
            currentPage="orders"
          />
        </div>
        <div className="orderData__header-settings">
          <button className="OrderData__settings-btn">
            <img src={settings} alt="settings" />
          </button>
        </div>
      </div>
      <div className="orderDataInfo">
        <div className="orderDataInfo__personalInfo">
          <div className="orderDataInfo__header">
            <div
              className={`orderDataInfo__fullName ${
                orderInfo.full_name != ""
                  ? "orderDataInfo-item-content"
                  : "orderDataInfo-item"
              }`}
            >
              <input
                className="orderDataInfo__input"
                value={orderInfo.full_name || ""}
                onChange={(e) => handleChange(e, "full_name")}
                onBlur={(e) => handleUpdate(e, "full_name")}
              />
            </div>
            <Link className="orderDataInfo__message orderDataInfo-item">
              Сообщения
            </Link>
          </div>
          <div className="orderDataInfo__email">
            <p 
              className={`orderDataInfo__email-text ${
                // orderInfo.email != ""
                  // ? "orderDataInfo-text-content"
                  // : 
                  "orderDataInfo-text"
              }`}>
              Email
            </p>
            <div 
              className={`orderDataInfo__email-content ${
                // orderInfo.email != ""
                  // ? "orderDataInfo-item-content"
                  // : 
                  "orderDataInfo-item"
              }`}>
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
        <div className="orderDataInfo__files">
          
        </div>
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
    </>
  );
};

export default OrderData;
