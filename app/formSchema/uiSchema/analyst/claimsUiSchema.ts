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
    'ui:widget': 'ExcelImportFileWidget',
    'ui:options': {
      excelImport: {
        successHeading: 'Claims & progress report Data table match database',
        errorType: 'claimsImportFailed',
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
