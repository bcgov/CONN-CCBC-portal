import { Dispatch } from 'react';

/**
 * Function generator made to get around the "no code copying" for sonarcloud, to be used in a callback or by itself
 * @param rowId The row id for the current application
 * @param ccbcNumber The ccbcNumber for the current application
 * @param setSowFile A react hook to set the sow file, optional
 * @param setSowValidationErrors A react hook to set validation errors, optional
 * @returns An async function that will post to the sow-upload validation and extraction.
 */
function sowValidateGenerator(
  rowId,
  ccbcNumber,
  setSowFile?: Dispatch<any>,
  setSowValidationErrors?: Dispatch<Array<any>>
) {
  return async function sowValidate(
    file,
    amendmentNumber?: number,
    validateOnly = true
  ) {
    const sowFileFormData = new FormData();
    if (file) {
      sowFileFormData.append('file', file);
      if (setSowFile) setSowFile(file);
      if (setSowValidationErrors) setSowValidationErrors([]);
      const response = await fetch(
        `/api/analyst/sow/${rowId}/${ccbcNumber}/${amendmentNumber}?validate=${validateOnly}`,
        {
          method: 'POST',
          body: sowFileFormData,
        }
      );

      const sowErrorList = await response.json();
      if (Array.isArray(sowErrorList) && sowErrorList.length > 0) {
        const errorList = sowErrorList.map( (item) =>{ return {...item, filename:file.name};})
        if (setSowValidationErrors) setSowValidationErrors(errorList);
      } else if (setSowValidationErrors) {
        setSowValidationErrors([]);
      }
      return response;
    }
    if (setSowValidationErrors) setSowValidationErrors([]);
  };
}

export default sowValidateGenerator;
