const claimsUiSchema = {
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
    },
  },
  evidenceOfCompletionFile: {
    'ui:widget': 'FileWidget',
  },
};

export default claimsUiSchema;
