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
    'ui:title':
      "This is the form indicating the stage of each of ISED's 1242 communities which is done each Jun 1, Sep 1, Dec 1, and Mar 1. After pressing Save & Import, the data will be extracted.",
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
