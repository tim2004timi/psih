import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import "./TagDropDownList.css";

const TagDropDownList = () => {
    const [tagList, setTagList] = useState([
        "бартер",
        "нет",
      ]);
      const [selectedTagList, setSelectedTagList] = useState("");
      const [isOpen, setIsOpen] = useState(false);
    
      const selectTag = (tag) => {
        setSelectedTagList(tag);
        setIsOpen(false);
      };
    
      return (
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenu.Trigger asChild>
            <button className="tag-dropdown-trigger">
              {selectedTagList === "" ? "Тег" : selectedTagList}
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
            <DropdownMenu.Content className="tag-dropdown-content">
              {tagList.map((tag, index) => {
                return (
                  <DropdownMenu.Item
                    key={index}
                    className="tag-dropdown-item"
                    onSelect={(event) => {
                      event.preventDefault();
                      selectTag(tag);
                    }}
                  >
                    {tag}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      );
}
 
export default TagDropDownList;