import React, { useEffect, useState } from "react";
import "../../../../../node_modules/react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import "./OrderTable.css";
import { getOrders, patchOrder } from "../../../../API/ordersAPI";
import SelectionArea from "../../../selectionArea/SelectionArea";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIds } from "./../../../stm/idsSlice";
import { formatDateTime } from "../../../../API/formateDateTime";
import NotificationManager from "../../../notificationManager/NotificationManager";
import NotificationStore from "../../../../NotificationStore";
import { observer } from 'mobx-react-lite';

const OrderTable = observer(({
  selectedColumns,
  childValue,
  selectedFilterItems,
  isFetchData,
}) => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [checkboxStates, setCheckboxStates] = useState({});
  const [showStatusList, setShowStatusList] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  let initialCheckboxStates;
  const [activeCheckboxCount, setActiveCheckboxCount] = useState(0);
  const [activeCheckboxIds, setActiveCheckboxIds] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState(new Set());
  const [uniqueTags, setTagsStatuses] = useState(new Set());
  const [
    handleCheckboxCount,
    handleIdList,
    handleStatusList,
    handleFetchData,
    handleTagList,
  ] = childValue;
  
  const { errorText, successText, setErrorText, setSuccessText, resetErrorText, resetSuccessText } = NotificationStore;

  const handleCheckboxChange = (rowId, event) => {
    // console.log('handleCheckboxChange')
    event.stopPropagation();
    setLastSelectedIndex(rowId);

    let countChange = 0;

    setCheckboxStates((prevState) => {
      window.getSelection().removeAllRanges();
      let upFlag;
      const newState = { ...prevState };
      // console.log(newState);

      if (event.shiftKey) {
        const start = Math.min(lastSelectedIndex, rowId);
        const end = Math.max(lastSelectedIndex, rowId);

        if (start == rowId) {
          upFlag = false;
        } else {
          upFlag = true;
        }

        if (upFlag) {
          for (let i = start + 1; i <= end; i++) {
            if (newState[i] !== undefined) {
              newState[i] = !newState[i];
              countChange += newState[i] ? 1 : -1;
              setActiveCheckboxIds((prevState) => [...prevState, i]);
            }
          }
        } else {
          for (let i = start; i < end; i++) {
            if (newState[i] !== undefined) {
              newState[i] = !newState[i];
              countChange += newState[i] ? 1 : -1;
              setActiveCheckboxIds((prevState) => [...prevState, i]);
            }
          }
        }
      } else {
        // console.log('here');
        const wasChecked = newState[rowId] || false;
        newState[rowId] = !wasChecked;
        countChange += newState[rowId] ? 1 : -1;
        setActiveCheckboxIds((prevState) => [...prevState, rowId]);
      }

      return newState;
    });

    setActiveCheckboxCount((prevCount) => prevCount + countChange);
  };

  useEffect(() => {
    handleCheckboxCount(
      Math.floor(activeCheckboxCount),
      activeCheckboxIds.filter(
        (item, index) => activeCheckboxIds.indexOf(item) === index
      )
    );
    // console.log(activeCheckboxIds.filter((item, index) => activeCheckboxIds.indexOf(item) === index))
  }, [activeCheckboxCount]);

  useEffect(() => {
    if (isFetchData) {
      fetchData();
      handleFetchData();
    }
  }, [isFetchData]);

  async function fetchData() {
    try {
      const response = await getOrders();
      setData(response.data);
      // console.log(response.data)
      initialCheckboxStates = response.data.reduce((acc, row) => {
        acc[row.id] = false;
        return acc;
      }, {});
      setCheckboxStates(initialCheckboxStates);
      const ids = response.data.map((row) => row.id);
      handleIdList(ids);
      dispatch(setIds(ids));
      const statuses = new Set(response.data.map((row) => row.status));
      setUniqueStatuses(statuses);
      handleStatusList(Array.from(statuses));
      const tags = new Set(response.data.map((row) => row.tag));
      setTagsStatuses(tags);
      handleTagList(Array.from(tags));
    } catch (error) {
      console.error(error);
      setErrorText(error.response.data.detail)
    }
  }

  useEffect(() => {
    fetchData();

    const handleDocumentClick = (event) => {
      if (!event.target.closest(".table")) {
        setCheckboxStates(initialCheckboxStates);
        setActiveCheckboxCount(0);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "в обработке":
        return "column-status__in-process";
      case "возврат":
        return "column-status__refund";
      case "доставлен":
        return "column-status__delivered";
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await patchOrder(orderId, "status", newStatus);
      setData((prevData) =>
        prevData.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setShowStatusList((prev) => ({ ...prev, [orderId]: false }));

      setUniqueStatuses((prevStatuses) => {
        const newStatuses = new Set(prevStatuses);
        newStatuses.add(newStatus);
        handleStatusList(Array.from(newStatuses));
        return newStatuses;
      });
      setSuccessText('Статус успешно обновлен!')
    } catch (error) {
      console.error("Error updating order status:", error);
      setErrorText(error.response.data.detail)
    }
  };

  const renderStatusList = (row) => {
    return (
      <div className="column-status__list-container">
        <div className="column-status__list">
          <button
            className="column-status__in-process"
            onClick={() => updateOrderStatus(row.id, "в обработке")}
          >
            в обработке
          </button>
          <button
            className="column-status__refund"
            onClick={() => updateOrderStatus(row.id, "возврат")}
          >
            возврат
          </button>
          <button
            className="column-status__delivered"
            onClick={() => updateOrderStatus(row.id, "доставлен")}
          >
            доставлен
          </button>
        </div>
      </div>
    );
  };

  const columnConfig = {
    "№": {
      className: "column-class column-number",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.id != null && (
          <div
            className={`column-number__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
          >
            <div className={`column-number-input__container`}>
              <input
                type="checkbox"
                className="column-number-input"
                checked={isChecked}
                readOnly
              />
              <span
                className="column-number-input__custom"
                onClick={(event) => {
                  handleCheckboxChange(row.id, event);
                  event.preventDefault();
                }}
              ></span>
            </div>
            <div className="column-number-link">
              <Link className="column-number-link-link" to={`/orders/${row.id}`}>
                {row.id}
              </Link>
            </div>
          </div>
        );
      },
    },

    дата: {
      className: "column-class column-date",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        const date = formatDateTime(row.order_date);
        return (
          row.order_date != null && (
            <div
              className={`column-date__container ${
                isChecked ? "highlighted-cell" : ""
              }`}
            >
              {date}
            </div>
          )
        );
      },
    },

    покупатель: {
      className: "column-class column-full_name",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.full_name != null ? (
          <div
            className={`column-full_name__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
            data-tooltip-id="full_name-tooltip"
            data-tooltip-content={row.full_name}
          >
            {row.full_name}
          </div>
        ) : null;
      },
    },

    статус: {
      className: "column-class column-status",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return (
          row.status != null && (
            <div>
              <button
                className={`column-status__container ${
                  isChecked ? "highlighted-cell" : ""
                } ${getStatusStyle(row.status)}`}
                onClick={() =>
                  setShowStatusList((prev) => ({
                    ...prev,
                    [row.id]: !prev[row.id],
                  }))
                }
              >
                {row.status}
              </button>
              {showStatusList[row.id] && renderStatusList(row)}
            </div>
          )
        );
      },
    },

    сообщения: {
      className: "column-class column-messages",
      content: (row) => row.messages,
    },

    тег: {
      className: "column-class column-tag",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return (
          row.tag != null && (
            <div
              className={`column-tag__container ${
                isChecked ? "highlighted-cell" : ""
              }`}
            >
              {row.tag}
            </div>
          )
        );
      },
    },

    сумма: {
      className: "column-class column-summ",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.summ != null && (
          <div
            className={`column-summ__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
          >
            {row.summ + " ₽"}
          </div>
        );
      },
    },

    "канал продаж": {
      className: "column-class column-channel",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.channel != null && (
          <div
            className={`column-channel__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
            data-tooltip-id="channel-tooltip"
            data-tooltip-content={row.channel}
          >
            {row.channel}
          </div>
        );
      },
    },

    "адрес доставки": {
      className: "column-class column-address",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.address != null && (
          <div
            className={`column-address__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
            data-tooltip-id="address-tooltip"
            data-tooltip-content={row.address}
          >
            {row.address}
          </div>
        );
      },
    },

    доставка: {
      className: "column-class column-storage",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.storage != null && (
          <div
            className={`column-storage__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
            data-tooltip-id="storage-tooltip"
            data-tooltip-content={row.storage}
          >
            {row.storage}
          </div>
        );
      },
    },

    заметки: {
      className: "column-class column-note",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.note != null && (
          <div
            className={`column-note__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
            data-tooltip-id="note-tooltip"
            data-tooltip-content={row.note}
          >
            {row.note}
          </div>
        );
      },
    },

    комментарий: {
      className: "column-class column-comment",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.comment != null && (
          <div
            className={`column-comment__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
            data-tooltip-id="comment-tooltip"
            data-tooltip-content={row.comment}
          >
            {row.comment}
          </div>
        );
      },
    },

    телефон: {
      className: "column-class column-phone_number",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.phone_number != null && (
          <div
            className={`column-phone_number__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
            data-tooltip-id="phone_number-tooltip"
            data-tooltip-content={row.phone_number}
          >
            {row.phone_number}
          </div>
        );
      },
    },

    почта: {
      className: "column-class column-email",
      content: (row) => {
        const isChecked = checkboxStates[row.id] || false;
        return row.email != null && (
          <div
            className={`column-email__container ${
              isChecked ? "highlighted-cell" : ""
            }`}
            data-tooltip-id="email-tooltip"
            data-tooltip-content={row.email}
          >
            {row.email}
          </div>
        );
      },
    },
  };

  const renderHeaders = () => {
    return selectedColumns.map((column, index) => (
      <th key={index} className="column-header">
        {column}
      </th>
    ));
  };

  // useEffect(() => {
  //   console.log(selectedFilterItems.order_date)
  //   // console.log(row.order_date)
  // }, [selectedFilterItems]);

  const renderRows = () => {
    return data
      .filter((row) => {
        if (Object.keys(selectedFilterItems).length === 0) {
          return true;
        }

        let date;

        if (selectedFilterItems.order_date.length !== 0) {
          date = formatDateTime(selectedFilterItems.order_date);
        }

        const idMatches =
          selectedFilterItems.id.length === 0 ||
          selectedFilterItems.id.includes(row.id);
        const statusMatches =
          selectedFilterItems.status.length === 0 ||
          selectedFilterItems.status.includes(row.status);
        const nameMatches =
          selectedFilterItems.full_name.length === 0 ||
          row.full_name.includes(selectedFilterItems.full_name);
        const tagMatches =
          selectedFilterItems.tag.length === 0 ||
          selectedFilterItems.tag.includes(row.tag);

        if (selectedFilterItems.order_date.length !== 0) {
          const filterDate = new Date(selectedFilterItems.order_date);
          const rowDate = new Date(row.order_date);

          const dateMatches =
            formatDateTime(filterDate) === formatDateTime(rowDate);

          return (
            idMatches &&
            statusMatches &&
            nameMatches &&
            tagMatches &&
            dateMatches
          );
        }

        return idMatches && statusMatches && nameMatches && tagMatches;
      })
      .map((row, rowIndex) => (
        <tr key={rowIndex} className="table-row">
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

  return (
    <>
      {/* <SelectionArea > */}
      <table className="table">
        <thead className="table-header">
          <tr>{renderHeaders()}</tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      <Tooltip id="full_name-tooltip" />
      {/* <Tooltip id="phone_number-tooltip" /> */}
      <Tooltip id="storage-tooltip" />
      <Tooltip id="address-tooltip" />
      <Tooltip id="note-tooltip" />
      <Tooltip id="comment-tooltip" />
      <Tooltip id="email-tooltip" />
      {errorText && <NotificationManager errorMessage={errorText} resetFunc={resetErrorText}/>}
      {successText && <NotificationManager successMessage={successText} resetFunc={resetSuccessText} />}
      {/* </SelectionArea > */}
    </>
  );
});

export default OrderTable;
