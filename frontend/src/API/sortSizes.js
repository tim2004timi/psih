export default function sortSizes(a, b) {
    const sizeOrder = ["S", "M", "L", "XL", "XXL"];
    return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
  };