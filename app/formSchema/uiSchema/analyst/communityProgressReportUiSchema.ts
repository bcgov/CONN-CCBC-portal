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
    'ui:title': 'Progress report file',
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
