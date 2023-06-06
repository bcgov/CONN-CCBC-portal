export const convertExcelDropdownToBoolean = (excelVal: 'Yes' | 'No') => {
  if (excelVal === 'Yes') {
    return true;
  }
  if (excelVal === 'No') {
    return false;
  }
  return undefined;
};


export const convertExcelDateToJSDate = (date) => {
  if (typeof date !== 'number') return null;
  return new Date(Math.round((date - 25569) * 86400 * 1000)).toISOString();
};

 
