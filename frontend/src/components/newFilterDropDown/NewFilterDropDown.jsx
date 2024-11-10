import React, {useState} from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const NewFilterDropDown = ({ filterItems, setFilterItems }) => {
  const [selectedFilterItems, setSelectedFilterItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item) => {
    setSelectedFilterItems((prevSelectedFilterItems) => {
        const isSelected = prevSelectedFilterItems.includes(item);

        if (isSelected) {
            return prevSelectedFilterItems.filter((selectedItem) => selectedItem !== item);
        } else {
            return [...prevSelectedFilterItems, item];
        }
    });

    // setFilterItems((prevFilterItems) => {
    //     const updatedFilterItems = prevFilterItems.filter((filterItem) => !selectedFilterItems.includes(filterItem));
    //     return updatedFilterItems;
    // })
};

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="tag-dropdown-trigger">
          {selectedFilterItems === "" ? "" : selectedFilterItems}
          <div className="tag-filterdropdownlist__content-btn">
            <span
              className={`tag-filterdropdownlist__arrow ${
                isOpen ? "tag-filterdropdownlist__arrow-active" : ""
              }`}
            >
              <span className="tag-filterdropdownlist__arrow-btn"></span>
              <span className="tag-filterdropdownlist__arrow-btn"></span>
            </span>
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="dropdown-content">
          {selectedFilterItems?.map((item, index) => (
            <DropdownMenu.Item
              key={index}
              className="dropdown-item dropdown-item--selected"
              onSelect={(event) => {
                event.preventDefault();
                handleSelect("cost_price", item);
              }}
            >
              {item}
            </DropdownMenu.Item>
          ))}
          {selectedFilterItems?.length > 0 && (
            <div className="dropdown-separator"></div>
          )}
          {Array.from(filterItems).map((item, index) => (
            <DropdownMenu.Item
              key={index}
              className="dropdown-item"
              onSelect={(event) => {
                event.preventDefault();
                handleSelect("cost_price", item);
              }}
            >
              {item}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NewFilterDropDown;
