import { ANALYST_EXCEL_FILE_EXTENSIONS } from '../constants';

const assessmentsUiSchema = {
  'ui:order': [
    'assignedTo',
    'targetDate',
    'nextStep',
    'decision',
    'notesAndConsiderations',
    'connectedCoastNetworkDependent',
    'crtcProjectDependent',
    'contestingMap',
    'assessmentTemplate',
    'completedAssessment',
    'otherFiles',
    'commentsOnCoverageData',
    'commentsOnHouseholdCounts',
    'commentsOnOverbuild',
    'commentsOnOverlap',
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
  connectedCoastNetworkDependent: {
    'ui:widget': 'SelectWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  crtcProjectDependent: {
    'ui:widget': 'SelectWidget',
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
      allowDragAndDrop: true,
    },
  },
  completedAssessment: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      allowMultipleFiles: true,
      allowDragAndDrop: true,
    },
  },
  otherFiles: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      allowMultipleFiles: true,
      allowDragAndDrop: true,
    },
  },
  notesAndConsiderations: {
    'ui:widget': 'TextAreaWidget',
    'ui:options': {
      boldTitle: true,
      maxLength: 1000,
      showCharacterCount: false,
    },
  },
  commentsOnCoverageData: {
    'ui:widget': 'TextAreaWidget',
    'ui:placeholder': 'Try to keep your responses brief and objective.',
    'ui:options': {
      boldTitle: true,
      maxLength: 1000,
      showCharacterCount: false,
    },
  },
  commentsOnHouseholdCounts: {
    'ui:widget': 'TextAreaWidget',
    'ui:placeholder': 'Try to keep your responses brief and objective.',
    'ui:options': {
      boldTitle: true,
      maxLength: 1000,
      showCharacterCount: false,
    },
  },
  commentsOnOverbuild: {
    'ui:widget': 'TextAreaWidget',
    'ui:placeholder': 'Try to keep your responses brief and objective.',
    'ui:options': {
      boldTitle: true,
      maxLength: 1000,
      showCharacterCount: false,
    },
  },
  commentsOnOverlap: {
    'ui:widget': 'TextAreaWidget',
    'ui:placeholder': 'Try to keep your responses brief and objective.',
    'ui:options': {
      boldTitle: true,
      maxLength: 1000,
      showCharacterCount: false,
    },
  },
};

export default assessmentsUiSchema;
