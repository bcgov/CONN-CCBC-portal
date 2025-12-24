const formatMoney = (number: number, decimals?: number) => {
  if (!number) return;

  let value = Number(number);

  if (decimals !== undefined) {
    value = Number(value.toFixed(decimals));
  }

  const [intPart, decimalPart] = value.toString().split('.');

  const formattedInt = Number(intPart).toLocaleString('en-US');

  // eslint-disable-next-line consistent-return
  return decimalPart !== undefined
    ? `$${formattedInt}.${decimalPart}`
    : `$${formattedInt}`;
};

export default formatMoney;
