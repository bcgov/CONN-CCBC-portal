const intakeUiSchema = {
  intakeNumber: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:options': {
      hideErrors: true,
    },
  },
  startDate: {
    'ui:widget': 'DateTimePickerWidget',
  },
  endDate: {
    'ui:widget': 'DateTimePickerWidget',
  },
  description: {
    'ui:options': {
      maxLength: 150,
      hideErrors: true,
      showCharacterCount: true,
    },
  },
  rollingIntake: {
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      title: 'Is Rolling intake',
    },
  },
};

export default intakeUiSchema;
