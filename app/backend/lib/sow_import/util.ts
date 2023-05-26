const convertExcelDropdownToBoolean = (excelVal: 'Yes' | 'No') => {
  if (excelVal === 'Yes') {
    return true;
  }
  if (excelVal === 'No') {
    return false;
  }
  return undefined;
};

export default convertExcelDropdownToBoolean;
