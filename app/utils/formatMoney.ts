const formatMoney = (number: number, decimals?: number) => {
  if (!number) return;
  let value = Number(number);
  if (decimals !== undefined) {
    value = Number(value.toFixed(decimals));
  }

  const [intPart, decimalPart] = value.toString().split('.');

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // eslint-disable-next-line consistent-return
  return decimalPart !== undefined
    ? `$${formattedInt}.${decimalPart}`
    : `$${formattedInt}`;
};

export default formatMoney;
