const isAcceptedNumber = (number) => {
  // Check if number is a valid number with up to 2 decimal places
  const pattern = '^-?[0-9]+(?:.[0-9]{1,2})?$';
  if ((number && number.toString().match(pattern)) || !number) {
    return true;
  }
  return false;
};

export default isAcceptedNumber;
