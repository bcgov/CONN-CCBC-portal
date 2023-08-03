const communityProgressReportUiSchema = {
  dueDate: {
    'ui:title': 'Due date',
    'ui:widget': 'DatePickerWidget',
  },
  dateReceived: {
    'ui:title': 'Date received',
    'ui:widget': 'DatePickerWidget',
  },
  progressReportFile: {
    'ui:title':
      "This is the form indicating the stage of each of ISED's 1242 communities which is done each Jun 1, Sep 1, Dec 1, and Mar 1. After pressing Save & Import, the data will be extracted.",
    'ui:widget': 'ExcelImportFileWidget',
    'ui:options': {
      excelFileWidgetSuccessHeading:
        'Community Progress Report data table match database',
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
