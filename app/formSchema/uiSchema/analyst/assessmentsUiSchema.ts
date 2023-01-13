import { ANALYST_EXCEL_FILE_EXTENSIONS } from '../constants';

const assessmentsUiSchema = {
  'ui:order': [
    'assignedTo',
    'targetDate',
    'nextStep',
    'decision',
    'notesAndConsiderations',
    'contestingMap',
    'assessmentTemplate',
    'completedAssessment',
    'otherFiles',
  ],
  assignedTo: {
    'ui:widget': 'AnalystSelectWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  targetDate: {
    'ui:widget': 'DatePickerWidget',
    'ui:options': {
      isClearable: true,
      boldTitle: true,
      addHorizontalLine: true,
    },
  },
  nextStep: {
    'ui:widget': 'RadioWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  decision: {
    'ui:widget': 'RadioWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  contestingMap: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  assessmentTemplate: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: ANALYST_EXCEL_FILE_EXTENSIONS,
      allowMultipleFiles: true,
    },
  },
  completedAssessment: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      allowMultipleFiles: true,
    },
  },
  otherFiles: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      allowMultipleFiles: true,
    },
  },
  notesAndConsiderations: {
    'ui:widget': 'TextAreaWidget',
    'ui:options': {
      boldTitle: true,
      maxLength: 1000,
    },
  },
};

export default assessmentsUiSchema;
