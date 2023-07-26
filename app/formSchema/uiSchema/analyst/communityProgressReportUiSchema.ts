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
    'ui:widget': 'FileWidget',
  },
  'ui:inline': [
    {
      columns: 3,
      dueDate: 1,
      dateReceived: 2,
    },
  ],
};

export default communityProgressReportUiSchema;
