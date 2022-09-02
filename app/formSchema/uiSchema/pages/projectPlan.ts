import { MAX_TEXTAREA_LENGTH } from '../constants';

const projectPlan = {
  projectStartDate: {
    'ui:widget': 'DatePickerWidget',
  },
  projectCompletionDate: {
    'ui:widget': 'DatePickerWidget',
  },
  relationshipManagerApplicant: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 2,500 characters',
    'ui:options': {
      maxLength: 2500,
    },
  },
  overviewProjectManagementTeam: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  overviewOfProjectParticipants: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  operationalPlan: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
};

export default projectPlan;
