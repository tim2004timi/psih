import React from "react";

const ProductFiles = () => {
  const columnConfig = {
    
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

  return <div className="product-files"></div>;
};

export default ProductFiles;
