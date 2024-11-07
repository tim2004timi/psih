import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import "./StatusDropDownList.css";

const StatusDropDownList = () => {
  const [statusList, setStatusList] = useState([
    "в обработке",
    "возврат",
    "доставлен",
  ]);
  const [selectedStatusList, setSelectedStatusList] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectStatus = (status) => {
    setSelectedStatusList(status);
    setIsOpen(false);
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="status-dropdown-trigger">
          {selectedStatusList === "" ? "Статус заказа" : selectedStatusList}
          <div className="status-filterdropdownlist__content-btn">
            <span
              className={`status-filterdropdownlist__arrow ${
                isOpen ? "status-filterdropdownlist__arrow-active" : ""
              }`}
            >
              <span className="status-filterdropdownlist__arrow-btn"></span>
              <span className="status-filterdropdownlist__arrow-btn"></span>
            </span>
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="status-dropdown-content">
          {statusList.map((status, index) => {
            return (
              <DropdownMenu.Item
                key={index}
                className="status-dropdown-item"
                onSelect={(event) => {
                  event.preventDefault();
                  selectStatus(status);
                }}
              >
                {status}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default StatusDropDownList;