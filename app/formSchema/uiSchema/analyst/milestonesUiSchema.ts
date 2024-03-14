const milestoneUiSchema = {
  dueDate: {
    'ui:title': 'Due date',
    'ui:widget': 'DatePickerWidget',
  },
  milestoneFile: {
    'ui:widget': 'ExcelImportFileWidget',
    'ui:options': {
      excelImport: {
        successHeading: 'Milestone Excel Data table match database',
        errorType: 'milestonesImportFailed',
      },
      allowDragAndDrop: true,
    },
  },
  evidenceOfCompletionFile: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      allowMultipleFiles: true,
      allowDragAndDrop: true,
    },
  },
};

export default milestoneUiSchema;
