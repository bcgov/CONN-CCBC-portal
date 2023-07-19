const intakeUiSchema = {
  startDate: {
    'ui:widget': 'DateTimePickerWidget',
  },
  endDate: {
    'ui:widget': 'DateTimePickerWidget',
  },
  description: {
    'ui:help': 'Maximum 150 characters',
    'ui:options': {
      maxLength: 150,
    },
  },
};

export default intakeUiSchema;
