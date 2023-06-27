import { render } from '@testing-library/react';
import { displaySowUploadErrors } from 'components/Analyst/Project/ProjectInformation/widgets/SowImportFileWidget';

describe('displaySowUploadErrors', () => {
  it('should display the default error message when the error type is unknown', () => {
    const { getByText } = render(
      displaySowUploadErrors({ level: 'unknown', error: 'Unknown error' })
    );
    expect(
      getByText(
        'An unknown error has occured while validating the Statement of Work data'
      )
    ).toBeInTheDocument();
    expect(getByText('Unknown error')).toBeInTheDocument();
  });

  it('should display the tab error message when the error type includes tab', () => {
    const { getByText } = render(
      displaySowUploadErrors({ level: 'tab 1', error: 'Tab error' })
    );
    expect(
      getByText(
        'There was an error importing the Statement of Work data at tab 1'
      )
    ).toBeInTheDocument();
    expect(getByText('Tab error')).toBeInTheDocument();
  });

  it('should display the summary error message when the error type is summary', () => {
    const { getByText } = render(
      displaySowUploadErrors({ level: 'summary', error: 'Summary error' })
    );
    expect(
      getByText(
        'There was an error importing the Statement of Work data at the Summary tab'
      )
    ).toBeInTheDocument();
    expect(getByText('Summary error')).toBeInTheDocument();
  });

  it('should display the database error message when the error type is database', () => {
    const { getByText } = render(
      displaySowUploadErrors({ level: 'database', error: 'Database error' })
    );
    expect(
      getByText('An error occured when validating the Statement of Work data')
    ).toBeInTheDocument();
    expect(getByText('Database error')).toBeInTheDocument();
  });

  it('should display the workbook error message when the error type is workbook', () => {
    const { getByText } = render(
      displaySowUploadErrors({ level: 'workbook', error: 'Workbook error' })
    );
    expect(
      getByText(
        'The Statement of Work sheet does not appear to contain the correct tabs.'
      )
    ).toBeInTheDocument();
    expect(getByText('Workbook error')).toBeInTheDocument();
  });
  it('should display multiple cell error messages when the errorMessage is an array', () => {
    const errorMessageArray = [
      { error: 'Cell error 1' },
      { error: 'Cell error 2' },
      { error: 'Cell error 3' },
    ];

    const { getByText } = render(
      displaySowUploadErrors({ level: 'cell', error: errorMessageArray })
    );

    errorMessageArray.forEach(({ error }) => {
      expect(getByText(error)).toBeInTheDocument();
    });
  });
});
