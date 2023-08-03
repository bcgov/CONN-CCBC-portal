const formatMoney = (number: number) => {
  if (!number) return;
  // eslint-disable-next-line consistent-return
  return `$${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export default formatMoney;
