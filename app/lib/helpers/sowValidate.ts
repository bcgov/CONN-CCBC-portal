import { Dispatch } from 'react';

function sowValidateGenerator(
  rowId,
  ccbcNumber,
  setSowFile?: Dispatch<any>,
  setSowValidationErrors?: Dispatch<Array<any>>
) {
  return async function sowValidate(file, validate = true) {
    const sowFileFormData = new FormData();
    sowFileFormData.append('file', file);
    setSowFile(file);
    const response = await fetch(
      `/api/analyst/sow/${rowId}/${ccbcNumber}?validate=${validate}`,
      {
        method: 'POST',
        body: sowFileFormData,
      }
    );

    const sowErrorList = await response.json();
    if (Array.isArray(sowErrorList) && sowErrorList.length > 0) {
      setSowValidationErrors(sowErrorList);
    } else {
      setSowValidationErrors([]);
    }
    return response;
  };
}

export default sowValidateGenerator;
