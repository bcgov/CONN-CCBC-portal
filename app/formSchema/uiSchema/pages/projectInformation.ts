import { MAX_LONG_INPUT_LENGTH, MAX_TEXTAREA_LENGTH } from '../constants';

const projectInformation = {
  'ui:order': [
    'projectTitle',
    'geographicAreaDescription',
    'projectDescription',
  ],
  'ui:title': '',
  projectTitle: {
    'ui:help': 'maximum 200 characters',
    'ui:title':
      'Provide a Project title. Be descriptive about the geographic region. Please refrain from using years in the title.',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  geographicAreaDescription: {
    'ui:help': 'maximum 150 characters',
    'ui:title':
      'Describe the geographic location of the Project area (i.e., include the closest communities and the general area which the Project will target).',
    'ui:options': {
      maxLength: 150,
    },
  },
  projectDescription: {
    'ui:widget': 'TextAreaWidget',
    'ui:help': 'maximum 3,500 characters',
    'ui:title':
      'Using non-technical language, provide a description of the Project, including its key elements, purpose, objectives and benefits. Identify the ‘who’, ‘what’, ‘where’, ‘when’ and ‘why’. Please avoid including Confidential or Proprietary information.',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
};

export default projectInformation;
