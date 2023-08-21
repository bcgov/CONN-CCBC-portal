const claimsUiSchema = {
  fromDate: {
    'ui:title': 'From',
    'ui:widget': 'DatePickerWidget',
  },
  toDate: {
    'ui:title': 'To',
    'ui:widget': 'DatePickerWidget',
  },
  claimsFile: {
    'ui:title':
      'Claims & progress reports are submitted by recipients for incurred or paid expenses during the previous quarter(s). While they are due 45 days after that quarter ends, recipients do not always submit claim & progress reports every quarter. \nAll processing of claims takes place outside of the CCBC portal. After a claim is processed and paid, please upload the finalized and completed claim Excel file here.',
    'ui:widget': 'ExcelImportFileWidget',
    'ui:options': {
      excelImport: {
        successHeading: 'Community Progress Report Data table match database',
        errorType: 'communityProgressImportFailed',
      },
    },
  },
  'ui:inline': [
    {
      columns: 6,
      fromDate: 1,
      toDate: 2,
    },
  ],
};

export default claimsUiSchema;
