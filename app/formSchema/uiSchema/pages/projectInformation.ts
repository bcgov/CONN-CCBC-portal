import { MAX_LONG_INPUT_LENGTH, MAX_TEXTAREA_LENGTH } from '../constants';

const projectInformation = {
  uiOrder: ['projectTitle', 'geographicAreaDescription', 'projectDescription'],
  projectTitle: {
    'ui:description': 'maximum 200 characters',
    'ui:title':
      'Project title. Be descriptive about the geographic region. Please refrain from using years in the title.',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  geographicAreaDescription: {
    'ui:description': 'maximum 150 characters',
    'ui:title':
      'Describe the geographic location of the Project area (i.e., include the closest communities and the general area which the Project will target).',
    'ui:options': {
      maxLength: 150,
    },
  },
  projectDescription: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:title':
      'Using non-technical language, provide a description of the Project, including its key elements, purpose, objectives and benefits. Identify the ‘who’, ‘what’, ‘where’, ‘when’ and ‘why’. Please avoid including Confidential or Proprietary information.',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
};

export default projectInformation;
