const claimsUiSchema = {
  claimsFile: {
    'ui:widget': 'ExcelImportFileWidget',
    'ui:options': {
      excelImport: {
        successHeading: 'Claims & progress report Data table match database',
        errorType: 'claimsImportFailed',
      },
    },
  },
};

export default claimsUiSchema;
