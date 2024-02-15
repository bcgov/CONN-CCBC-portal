import { MAX_TEXTAREA_LENGTH } from '../constants';

const techSolution = {
  'ui:order': [
    'systemDesign',
    'scalability',
    'backboneTechnology',
    'lastMileTechnology',
  ],
  'ui:title': '',
  systemDesign: {
    'ui:widget': 'TextAreaWidget',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  scalability: {
    'ui:widget': 'TextAreaWidget',
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
