const communityProgressReportUiSchema = {
  dueDate: {
    'ui:title': 'Due date',
    'ui:widget': 'DatePickerWidget',
  },
  dateReceived: {
    'ui:title': 'Date received',
    'ui:widget': 'DatePickerWidget',
    'ui:options': {
      hideErrors: true,
    },
  },
  errorField: {
    'ui:widget': 'ContextErrorWidget',
  },
  progressReportFile: {
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
      dueDate: 1,
      dateReceived: 2,
    },
  ],
};

export default communityProgressReportUiSchema;
