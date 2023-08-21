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
