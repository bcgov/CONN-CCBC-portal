import { MAX_TEXTAREA_LENGTH } from '../constants';

const techSolution = {
  uiOrder: [
    'systemDesign',
    'scalability',
    'backboneTechnology',
    'lastMileTechnology',
  ],
  systemDesign: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  scalability: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  backboneTechnology: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  lastMileTechnology: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
};

export default techSolution;
