import { EXCEL_FILE_EXTENSIONS } from '../constants';

const screeningUiSchema = {
  'ui:order': [
    'assignedTo',
    'targetDate',
    'nextStep',
    'decision',
    'contestingMap',
    'assessmentTemplate',
    'otherFiles',
  ],
  assignedTo: {
    'ui:widget': 'AnalystSelectWidget',
  },
  targetDate: {
    'ui:widget': 'DatePickerWidget',
    'ui:options': {
      isClearable: true,
    },
  },
  nextStep: {
    'ui:widget': 'RadioWidget',
  },
  decision: {
    'ui:widget': 'RadioWidget',
  },
  contestingMap: {
    'ui:widget': 'CheckboxesWidget',
  },
  assessmentTemplate: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  otherFiles: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
    },
  },
};

export default screeningUiSchema;
