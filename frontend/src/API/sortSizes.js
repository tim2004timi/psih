export default function sortSizes(a, b) {
  const sizeOrder = ["S", "M", "L", "XL", "XXL"];

    return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
};