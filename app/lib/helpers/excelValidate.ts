import { Dispatch } from 'react';
import fetchWithTimeout from './fetchWithTimeout';
import reportClientError from './reportClientError';

/**
 * Function generator made to get around the "no code copying" for sonarcloud, to be used in a callback or by itself
 * @param apiPath The path to the api, e.g. /api/sow-upload/[applicationId]
 * @param setFile A react hook to set the file, optional
 * @param setValidationErrors A react hook to set validation errors, optional
 * @returns An async function that will post to the sow-upload validation and extraction.
 */
function excelValidateGenerator(
  apiPath: string,
  setExcelFile?: Dispatch<any>,
  setExcelValidationErrors?: Dispatch<Array<any>>
) {
  return async function validate(
    file,
    validateOnly = true,
    operation = 'UPDATE'
  ) {
    const fileFormData = new FormData();
    if (file) {
      fileFormData.append('file', file);
      if (setExcelFile) setExcelFile(file);
      if (setExcelValidationErrors) setExcelValidationErrors([]);
      try {
        const response = await fetchWithTimeout(
          `${apiPath}/?validate=${validateOnly}&operation=${operation}`,
          {
            method: 'POST',
            body: fileFormData,
          }
        );

        const errorListResponse = await response.json();
        if (Array.isArray(errorListResponse) && errorListResponse.length > 0) {
          const errorList = errorListResponse.map((item) => {
            return { ...item, filename: file.name };
          });
          if (setExcelValidationErrors) setExcelValidationErrors(errorList);
        } else if (setExcelValidationErrors) {
          setExcelValidationErrors([]);
        }

        // return error list and status since response.json has been consumed and locked
        return { ...errorListResponse, status: response.status };
      } catch (error) {
        reportClientError(error, { source: 'excel-validate' });
        if (setExcelValidationErrors) {
          setExcelValidationErrors([
            {
              error:
                ' If the issue persists, <a href="mailto:meherzad.romer@gov.bc.ca">contact the development team.</a>',
              level: 'timeout',
              filename: file.name,
            },
          ]);
        }
        return {
          level: 'timeout',
          error:
            ' If the issue persists, <a href="mailto:meherzad.romer@gov.bc.ca">contact the development team.</a>',
          filename: file.name,
        };
      }
    }
    if (setExcelValidationErrors) setExcelValidationErrors([]);
    return null;
  };
}

export default excelValidateGenerator;
