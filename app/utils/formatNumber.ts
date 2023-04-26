const formatNumber = (value) => {
  // format to 2 decimal places if a number has decimals, if not return whole number
  if (value && value % 1 !== 0) {
    return Number(value.toFixed(2));
  }
  return Number(value);
};

export default formatNumber;
