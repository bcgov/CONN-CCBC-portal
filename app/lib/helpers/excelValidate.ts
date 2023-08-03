import { Dispatch } from 'react';

/**
 * Function generator made to get around the "no code copying" for sonarcloud, to be used in a callback or by itself
 * @param setFile A react hook to set the file, optional
 * @param setValidationErrors A react hook to set validation errors, optional
 * @returns An async function that will post to the sow-upload validation and extraction.
 */
function excelValidateGenerator(
  apiPath: string,
  setExcelFile?: Dispatch<any>,
  setExcelValidationErrors?: Dispatch<Array<any>>
) {
  return async function validate(file, validateOnly = true) {
    const fileFormData = new FormData();
    if (file) {
      fileFormData.append('file', file);
      if (setExcelFile) setExcelFile(file);
      if (setExcelValidationErrors) setExcelValidationErrors([]);
      const response = await fetch(`${apiPath}/?validate=${validateOnly}`, {
        method: 'POST',
        body: fileFormData,
      });

      const errorListResponse = await response.json();
      if (Array.isArray(errorListResponse) && errorListResponse.length > 0) {
        const errorList = errorListResponse.map((item) => {
          return { ...item, filename: file.name };
        });
        if (setExcelValidationErrors) setExcelValidationErrors(errorList);
      } else if (setExcelValidationErrors) {
        setExcelValidationErrors([]);
      }
      return response;
    }
    if (setExcelValidationErrors) setExcelValidationErrors([]);
    return null;
  };
}

export default excelValidateGenerator;
