const truncateNumber = (number: number | string, index: number = 2) =>
  +number.toString().slice(0, number.toString().indexOf('.') + (index + 1));

export default truncateNumber;
