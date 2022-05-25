const truncateNumber = (number: number | string, sliceLength: number = 2) =>
  +number.toString().slice(0, number.toString().indexOf('.') + (sliceLength + 1));

export default truncateNumber;
