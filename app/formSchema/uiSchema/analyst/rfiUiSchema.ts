const rfiUiSchema = {
  'ui:order': [
    'rfiType',
    'rfiDueBy',
    'rfiEmailCorrespondance',
    'rfiAdditionalFiles',
  ],
  'ui:title': '',
  rfiType: {
    'ui:widget': 'CheckboxesWidget',
  },
  rfiDueBy: {
    'ui:widget': 'DatePickerWidget',
  },
  rfiEmailCorrespondance: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
    },
  },
  rfiAdditionalFiles: {
    'ui:widget': 'CheckboxesWidget',
  },
};

export default rfiUiSchema;
